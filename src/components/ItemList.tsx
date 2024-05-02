import { useState } from 'react';
import styles from './ItemList.module.css';
import SortMenu, { Category, SortDef } from './SortMenu';
import SearchBox, { SearchField } from './SearchBox';
import FilterMenu, { FilterGroupDef } from './FilterMenu';

type Props<T extends object> = {
  items: T[],
  Item: React.FC<{ item: T, className?: string | undefined }>,
  filterDefs: FilterGroupDef<T>[]
  sortDefs: SortDef<T>[]
  fallbackSortDef?: SortDef<T>
  searchFields: SearchField<T>[]
  className?: string | undefined
};

export default function ItemList<T extends object>({
  items,
  Item,
  filterDefs,
  sortDefs,
  fallbackSortDef,
  searchFields,
  className,
}: Props<T>) {
  const [filteredItems, setFilteredItems] = useState(items);
  const [categories, setCategories] = useState<Category<T>[]>([]);
  const [searchedItems, setSearchedItems] = useState<T[]>(items);

  return (
    <div className={`${styles['container']} ${className ?? ''}`}>
      <div className={styles['header']}>
        <div className={styles['menus']}>
          <FilterMenu
            items={items}
            filters={filterDefs}
            onFiltered={setFilteredItems}
          />

          <SortMenu
            items={searchedItems}
            sortDefs={sortDefs}
            fallbackSortDef={fallbackSortDef}
            onSorted={setCategories}
          />
        </div>
        <SearchBox
          items={filteredItems}
          searchFields={searchFields}
          onSearched={setSearchedItems}
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
