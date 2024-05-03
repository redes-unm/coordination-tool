import useFilter, { Filter } from '@/hooks/useFilter';
import useSearch, { SearchField } from '@/hooks/useSearch';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import useSort, { SortCriteria, SortCriterion } from '@/hooks/useSort';
import styles from './ItemList.module.css';
import SortMenu from './SortMenu';
import FilterMenu from './FilterMenu';
import TextInput from './TextInput';

type Props<T extends object> = {
  items: T[],
  Item: React.FC<{ item: T, className?: string | undefined }>,
  filter: Filter<T>
  sortCriteria: SortCriteria<T>
  fallbackSortCriterion?: SortCriterion<T>
  searchFields: SearchField<T>[]
  className?: string | undefined
};

export default function ItemList<T extends object>({
  items,
  Item,
  filter,
  sortCriteria,
  fallbackSortCriterion,
  searchFields,
  className,
}: Props<T>) {
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

  const {
    sorted,
    sortNames,
    sortCriteriaOrder,
    setSortCriteriaOrder,
    sortDirection,
    setSortDirection,
  } = useSort(searched, sortCriteria, fallbackSortCriterion);

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
            names={sortNames}
            criteriaOrder={sortCriteriaOrder}
            setCriteriaOrder={setSortCriteriaOrder}
            direction={sortDirection}
            setDirection={setSortDirection}
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
          sorted.map(({ name, items: catItems }) => (
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
