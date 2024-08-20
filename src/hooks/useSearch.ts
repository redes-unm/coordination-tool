import debounce from 'debounce';
import { useEffect, useMemo, useState } from 'react';

export type SearchField<T extends object> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T];

function assertString(s: unknown): asserts s is string {
  if (typeof s !== 'string') {
    throw Error(`expected string, got ${typeof s}`);
  }
}

export default function useSearch<T extends object>(
  things: T[],
  fields: SearchField<T>[],
  onSearch?: ((test: string) => void) | null,
  debounceMillis = 300,
): {
    searched: T[]
    searchText: string
    setSearchText: (text: string) => void
  } {
  const [searchText, setSearchText] = useState('');
  const [searched, setSearched] = useState(things);

  const search = useMemo(() => debounce((text: string) => {
    if (text && onSearch) onSearch(text);
    setSearched(things.filter((t) => fields.some((field) => {
      const val = t[field];
      assertString(val);
      return val.toLowerCase().includes(text.toLowerCase());
    })));
  }, debounceMillis), [things, fields, debounceMillis, onSearch]);

  useEffect(() => search(searchText), [search, searchText]);

  return {
    searched,
    searchText,
    setSearchText,
  };
}
