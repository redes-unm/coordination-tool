import { useEffect, useMemo, useState } from 'react';

export type Filter<T> = { [id: string]: FilterGroup<T> };
type FilterGroup<T> = { name: string, items: { [id: string]: FilterItem<T> } };
type FilterItem<T> = FunctionFilterItem<T> | (T extends object ? ValueFilterItem<T> : never);
type FunctionFilterItem<T> = { name: string, match: (t: T) => boolean };
type ValueFilterItem<T extends object> = {
  [K in keyof T]: { name: string, field: K, value: T[K] }
}[keyof T];

function matchFilterItem<T>(item: FilterItem<T>, thing: T): boolean {
  return 'match' in item ? item.match(thing) : thing[item.field] === item.value;
}

export type FilterNames = { [id: string]: FilterGroupNames };
type FilterGroupNames = { name: string, items: { [id: string]: string } };

function extractNames<T>(filter: Filter<T>): FilterNames {
  return Object.entries(filter).reduce<FilterNames>((names, [groupId, group]) => ({
    ...names,
    [groupId]: {
      name: group.name,
      items: Object.entries(group.items).reduce((itemNames, [itemId, item]) => ({
        ...itemNames,
        [itemId]: item.name,
      }), {}),
    },
  }), {});
}

export type FilterEnabled = { [id: string]: FilterGroupEnabled };
type FilterGroupEnabled = { [id: string]: boolean };

function makeEnabled<T>(filter: Filter<T>, oldEnabled: FilterEnabled): FilterEnabled {
  return Object.entries(filter).reduce<FilterEnabled>((enabled, [groupId, group]) => ({
    ...enabled,
    [groupId]: Object.entries(group.items).reduce((itemsEnabled, [itemId]) => ({
      ...itemsEnabled,
      [itemId]: oldEnabled[groupId]?.[itemId] ?? true,
    }), {}),
  }), {});
}

export function toggleAllEnabled(enabled: FilterEnabled, enable: boolean): FilterEnabled {
  return Object.entries(enabled).reduce((newEnabled, [groupId, group]) => ({
    ...newEnabled,
    [groupId]: Object.entries(group).reduce((newItemsEnabled, [itemId]) => ({
      ...newItemsEnabled,
      [itemId]: enable,
    }), {}),
  }), {});
}

export function toggleSingleEnabled(
  enabled: FilterEnabled,
  groupId: string,
  itemId: string,
  enable: boolean,
): FilterEnabled {
  return {
    ...enabled,
    [groupId]: { ...enabled[groupId], [itemId]: enable },
  };
}

export default function useFilter<T>(things: T[], filter: Filter<T>): {
  filtered: T[]
  filterNames: FilterNames
  filterEnabled: FilterEnabled
  setFilterEnabled: (e: FilterEnabled | ((old: FilterEnabled) => FilterEnabled)) => void
} {
  const [enabled, setEnabled] = useState<FilterEnabled>(() => makeEnabled(filter, {}));

  useEffect(() => setEnabled((old) => makeEnabled(filter, old)), [filter]);

  return {
    filtered: useMemo(() => (
      things.filter((thing) => (
        Object.entries(filter).every(([groupId, group]) => (
          Object.entries(group.items).some(([itemId, item]) => (
            enabled[groupId]?.[itemId] && matchFilterItem(item, thing)
          ))
        ))
      ))
    ), [things, filter, enabled]),
    filterNames: useMemo(() => extractNames(filter), [filter]),
    filterEnabled: enabled,
    setFilterEnabled: setEnabled,
  };
}
