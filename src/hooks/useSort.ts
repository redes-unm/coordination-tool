import { throwErr } from '@/lib/util';
import { useMemo, useState } from 'react';

export type SortCriteria<T> = { [id: string]: SortCriterion<T> };

export type SortCriterion<T> = FunctionSortCriterion<T>
| (T extends object ? CompareSortCriterion<T> : never)
| (T extends object ? EnumSortCriterion<T> : never);

type FunctionSortCriterion<T> = BaseSortCriterion<T> & { sort: (a: T, b: T) => number };

type CompareSortCriterion<T extends object> = {
  [K in keyof T]: BaseSortCriterion<T> & { field: K }
}[keyof T];

type EnumSortCriterion<T extends object> = {
  [K in keyof T]: BaseSortCriterion<T> & { field: K, order: T[K][] }
}[keyof T];

type BaseSortCriterion<T> = { name: string, categories?: SortCategory<T>[] };

function criterionSort<T>(criterion: SortCriterion<T>, a: T, b: T): number {
  if ('sort' in criterion) {
    return criterion.sort(a, b);
  }

  if ('order' in criterion) {
    const aIndex = criterion.order.indexOf(a[criterion.field]);
    const bIndex = criterion.order.indexOf(b[criterion.field]);
    return (aIndex < 0 ? Infinity : aIndex) - (bIndex < 0 ? Infinity : bIndex);
  }

  if (a[criterion.field] < b[criterion.field]) {
    return -1;
  }
  if (a[criterion.field] > b[criterion.field]) {
    return 1;
  }
  return 0;
}

type SortCategory<T> = FunctionSortCategory<T>
| (T extends object ? ValueSortCategory<T> : never);

type FunctionSortCategory<T> = { name: string, match: (t: T) => boolean };
type ValueSortCategory<T extends object> = {
  [K in keyof T]: { name: string, field: K, value: T[K] }
}[keyof T];

function categoryMatch<T>(cat: SortCategory<T>, t: T): boolean {
  return 'match' in cat ? cat.match(t) : t[cat.field] === cat.value;
}

export type SortCriteriaOrder = string[];
export type SortDirection = 'ascending' | 'descending';

export function sortItems<T>(
  items: T[],
  orderedCriteria: SortCriterion<T>[],
  direction: SortDirection,
): T[] {
  const lt = direction === 'ascending' ? -1 : 1;
  const gt = lt * -1;
  const eq = 0;

  return [...items].sort((a, b) => {
    // the linter says a `for (const a of b) {}` loop requires pulling in a
    // heavyweight runtime, so avoid it
    for (let i = 0; i < orderedCriteria.length; i += 1) {
      const criterion = orderedCriteria[i] ?? throwErr('missing def for index');
      const s = criterionSort(criterion, a, b);
      if (s < 0) {
        return lt;
      }
      if (s > 0) {
        return gt;
      }
    }

    return eq;
  });
}

type Categorized<T> = { name: string, items: T[] }[];

function categorizeItems<T>(
  items: T[],
  categories: SortCategory<T>[],
  direction: SortDirection,
): Categorized<T> {
  const categorized = categories
    .map((cat) => ({ name: cat.name, items: items.filter((i) => categoryMatch(cat, i)) }))
    .filter((cat) => cat.items.length > 0);

  if (categorized.length === 0 && items.length > 0) {
    categorized.push({ name: '', items });
  }

  return direction === 'ascending' ? categorized : categorized.reverse();
}

export type SortNames = { [id: string]: string };

function extractNames<T>(criteria: SortCriteria<T>): SortNames {
  return Object.entries(criteria).reduce((names, [id, criterion]) => ({
    ...names,
    [id]: criterion.name,
  }), {});
}

export default function useSort<T>(
  items: T[],
  criteria: SortCriteria<T>,
  fallbackCriterion?: SortCriterion<T>,
): {
    sorted: Categorized<T>
    sortNames: SortNames
    sortCriteriaOrder: SortCriteriaOrder
    setSortCriteriaOrder: (o: SortCriteriaOrder) => void
    sortDirection: SortDirection
    setSortDirection: (o: SortDirection) => void
  } {
  const [
    criteriaOrder,
    setCriteriaOrder,
  ] = useState<SortCriteriaOrder>(() => Object.keys(criteria));

  const [direction, setDirection] = useState<SortDirection>('ascending');

  return {
    sorted: useMemo(() => {
      const orderedCriteria = criteriaOrder
        .map((id) => criteria[id] ?? throwErr('invalid sort criteria order'));

      if (fallbackCriterion) orderedCriteria.push(fallbackCriterion);

      return categorizeItems(
        sortItems(items, orderedCriteria, direction),
        orderedCriteria[0]?.categories ?? [],
        direction,
      );
    }, [items, criteria, criteriaOrder, fallbackCriterion, direction]),
    sortNames: useMemo(() => extractNames(criteria), [criteria]),
    sortCriteriaOrder: criteriaOrder,
    setSortCriteriaOrder: setCriteriaOrder,
    sortDirection: direction,
    setSortDirection: setDirection,
  };
}
