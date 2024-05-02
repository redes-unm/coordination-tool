import * as Dropdown from '@radix-ui/react-dropdown-menu';
import btnStyles from '@/components/Button.module.css';
import menuStyles from '@/components/Menu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightArrowLeft,
  faCheck, faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useMemo, useState } from 'react';
import { throwErr } from '@/lib/util';

type ValueCategoryDef<T extends object> = {
  [K in keyof T]: { name: string, field: K, value: T[K] }
}[keyof T];

function categoryMatchValue<T extends object>(def: ValueCategoryDef<T>, t: T): boolean {
  return t[def.field] === def.value;
}

type FunctionCategoryDef<T> = { name: string, match: (t: T) => boolean };

function categoryMatchFunction<T>(def: FunctionCategoryDef<T>, t: T): boolean {
  return def.match(t);
}

type CategoryDef<T> = FunctionCategoryDef<T> | (T extends object ? ValueCategoryDef<T> : never);

function categoryMatch<T>(def: CategoryDef<T>, t: T): boolean {
  return 'match' in def ? categoryMatchFunction(def, t) : categoryMatchValue(def, t);
}

type BaseSortDef<T> = {
  key: string // must be unique and also serves as display name
  categoryDefs?: CategoryDef<T>[]
};

type EnumSortDef<T extends object> = BaseSortDef<T> & {
  [K in keyof T]: { field: K, order: T[K][] }
}[keyof T];

function sortEnum<T extends object>(def: EnumSortDef<T>, a: T, b: T): number {
  const aIndex = def.order.indexOf(a[def.field]);
  const bIndex = def.order.indexOf(b[def.field]);
  return (aIndex < 0 ? Infinity : aIndex) - (bIndex < 0 ? Infinity : bIndex);
}

type CompareSortDef<T extends object> = BaseSortDef<T> & {
  [K in keyof T]: { field: K }
}[keyof T];

function sortCompare<T extends object>(def: CompareSortDef<T>, a: T, b: T): number {
  if (a[def.field] < b[def.field]) {
    return -1;
  }
  if (a[def.field] > b[def.field]) {
    return 1;
  }
  return 0;
}

type FunctionSortDef<T> = BaseSortDef<T> & { sort: (a: T, b: T) => number };

function sortFunction<T>(def: FunctionSortDef<T>, a: T, b: T): number {
  return def.sort(a, b);
}

export type SortDef<T> = FunctionSortDef<T>
| (T extends object ? EnumSortDef<T> : never)
| (T extends object ? CompareSortDef<T> : never);

function sort<T>(def: SortDef<T>, a: T, b: T): number {
  if ('sort' in def) {
    return sortFunction(def, a, b);
  }

  return 'order' in def ? sortEnum(def, a, b) : sortCompare(def, a, b);
}

function sortItems<T>(items: T[], defs: SortDef<T>[], ascending: boolean): T[] {
  const lt = ascending ? -1 : 1;
  const gt = lt * -1;
  const eq = 0;

  return [...items].sort((a, b) => {
    // the linter says a for (const def of defs) {} loop requires pulling in a
    // heavyweight runtime, so avoid it
    for (let i = 0; i < defs.length; i += 1) {
      const def = defs[i] ?? throwErr('missing def for index');
      const s = sort(def, a, b);
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

type Props<T> = {
  items: T[]
  sortDefs: SortDef<T>[]
  fallbackSortDef?: SortDef<T> | undefined
  onSorted: (categories: Category<T>[]) => void
};

export type Category<T> = {
  name: string
  items: T[]
};

export default function SortMenu<T>({
  items,
  sortDefs,
  fallbackSortDef,
  onSorted,
}: Props<T>) {
  const [mainSortDefIndex, setMainSortDefIndex] = useState(0);
  const [ascending, setAscending] = useState(true);
  const mainSortDef = useMemo(() => (
    sortDefs[mainSortDefIndex]
      ?? sortDefs[0]
      ?? fallbackSortDef
      ?? throwErr('no sort defs')
  ), [sortDefs, fallbackSortDef, mainSortDefIndex]);

  useEffect(() => {
    const orderedSortDefs = [
      mainSortDef,
      ...sortDefs.filter((d) => d !== mainSortDef),
      ...(fallbackSortDef ? [fallbackSortDef] : []),
    ];

    const sorted = sortItems(items, orderedSortDefs, ascending);

    const categories = (mainSortDef.categoryDefs ?? [])
      .map((def) => ({ name: def.name, items: sorted.filter((i) => categoryMatch(def, i)) }))
      .filter((category) => category.items.length > 0);

    if (categories.length === 0 && sorted.length > 0) {
      categories.push({ name: '', items: sorted });
    }

    onSorted(ascending ? categories : categories.reverse());
  }, [items, sortDefs, fallbackSortDef, onSorted, mainSortDef, ascending]);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger className={`${btnStyles['btn']} ${menuStyles['menu-btn']}`}>
        <span>
          <FontAwesomeIcon
            icon={faArrowRightArrowLeft}
            className={btnStyles['icon'] ?? ''}
            style={{ transform: 'rotate(90deg)' }}
          />
          Sort
        </span>
        <span className={menuStyles['menu-icon']}>
          <FontAwesomeIcon icon={faChevronDown} className={menuStyles['menu-icon-closed'] || ''} />
          <FontAwesomeIcon icon={faChevronUp} className={menuStyles['menu-icon-open'] || ''} />
        </span>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content className={menuStyles['menu-content']}>
          <Dropdown.Arrow className={menuStyles['menu-arrow']} />

          <Dropdown.RadioGroup value={mainSortDef.key}>
            <Dropdown.Label className={menuStyles['menu-label']}>
              Sort by
            </Dropdown.Label>
            {
                sortDefs.map((def, i) => (
                  <Dropdown.RadioItem
                    key={def.key}
                    className={menuStyles['menu-item']}
                    value={def.key}
                    onSelect={(e) => {
                      e.preventDefault();
                      setMainSortDefIndex(i);
                    }}
                  >
                    <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                      <FontAwesomeIcon icon={faCheck} />
                    </Dropdown.ItemIndicator>
                    {def.key}
                  </Dropdown.RadioItem>
                ))
              }
          </Dropdown.RadioGroup>

          <Dropdown.Separator className={menuStyles['separator']}>
            <hr />
          </Dropdown.Separator>

          <Dropdown.RadioGroup value={ascending ? 'asc' : 'desc'}>
            <Dropdown.Label className={menuStyles['menu-label']}>
              Order
            </Dropdown.Label>
            <Dropdown.RadioItem
              className={menuStyles['menu-item']}
              value="asc"
              onSelect={(e) => {
                e.preventDefault();
                setAscending(true);
              }}
            >
              <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                <FontAwesomeIcon icon={faCheck} />
              </Dropdown.ItemIndicator>
              Ascending
            </Dropdown.RadioItem>
            <Dropdown.RadioItem
              className={menuStyles['menu-item']}
              value="desc"
              onSelect={(e) => {
                e.preventDefault();
                setAscending(false);
              }}
            >
              <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                <FontAwesomeIcon icon={faCheck} />
              </Dropdown.ItemIndicator>
              Descending
            </Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
