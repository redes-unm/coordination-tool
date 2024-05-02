import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useMemo, useState } from 'react';
import debounce from 'debounce';
import TextInput from './TextInput';

export type SearchField<T extends object> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T];

type Props<T extends object> = {
  items: T[]
  searchFields: SearchField<T>[]
  onSearched: (items: T[]) => void
  debounceMillis?: number
};

function assertString(s: unknown): asserts s is string {
  if (typeof s !== 'string') {
    throw Error(`expected string, got ${typeof s}`);
  }
}

export default function SearchBox<T extends object>({
  items,
  searchFields,
  onSearched,
  debounceMillis = 300,
}: Props<T>) {
  const [searchText, setSearchText] = useState('');

  const search = useMemo(() => debounce((text: string) => {
    onSearched(items.filter((t) => searchFields.some((field) => {
      const val = t[field];
      assertString(val);
      return val.toLowerCase().includes(text.toLowerCase());
    })));
  }, debounceMillis), [onSearched, items, searchFields, debounceMillis]);

  useEffect(() => search(searchText), [search, searchText]);

  return (
    <TextInput
      label="Search"
      placeholder="Search"
      icon={faSearch}
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      hideLabel
    />
  );
}
