import { useState } from 'react';
import useFilter, { Filter } from '@/hooks/useFilter';
import useSearch, { SearchField } from '@/hooks/useSearch';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './ItemList.module.css';
import SortMenu, { Category, SortDef } from './SortMenu';
import FilterMenu from './FilterMenu';
import TextInput from './TextInput';

type Props<T extends object> = {
  items: T[],
  Item: React.FC<{ item: T, className?: string | undefined }>,
  filter: Filter<T>
  sortDefs: SortDef<T>[]
  fallbackSortDef?: SortDef<T>
  searchFields: SearchField<T>[]
  className?: string | undefined
};

export default function ItemList<T extends object>({
  items,
  Item,
  filter,
  sortDefs,
  fallbackSortDef,
  searchFields,
  className,
}: Props<T>) {
  const [categories, setCategories] = useState<Category<T>[]>([]);

  const {
    filtered,
    filterNames,
    filterEnabled,
    setFilterEnabled,
  } = useFilter(items, filter);

  const {
    searched,
    searchText,
    setSearchText,
  } = useSearch(filtered, searchFields);

  return (
    <div className={`${styles['container']} ${className ?? ''}`}>
      <div className={styles['header']}>
        <div className={styles['menus']}>
          <FilterMenu
            names={filterNames}
            enabled={filterEnabled}
            onEnabledChange={setFilterEnabled}
          />

          <SortMenu
            items={searched}
            sortDefs={sortDefs}
            fallbackSortDef={fallbackSortDef}
            onSorted={setCategories}
          />
        </div>
        <TextInput
          label="Search"
          placeholder="Search"
          icon={faSearch}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          hideLabel
        />
      </div>
      <div className={styles['list']}>
        {
          categories.map(({ name, items: catItems }) => (
            <div className={styles['category']} key={name}>
              {name && <h3>{name}</h3>}
              {catItems.map((t, i) => (
                <Item
                  item={t}
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  className={styles['item']}
                />
              ))}
            </div>
          ))
        }
      </div>
    </div>
  );
}
