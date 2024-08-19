import { FilterEnabled, FilterNames } from '@/hooks/useFilter';
import useSearch, { SearchField } from '@/hooks/useSearch';
import useSort, { SortCriteria, SortCriterion } from '@/hooks/useSort';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addIcon, searchIcon } from '@/icons';
import styles from './ItemList.module.css';
import btnStyles from './Button.module.css';
import SortMenu from './SortMenu';
import FilterMenu from './FilterMenu';
import TextInput from './TextInput';

type Props<T extends object> = {
  items: T[],
  Item: React.FC<{ item: T, className?: string | undefined }>,
  filterNames: FilterNames
  filterEnabled: FilterEnabled
  onFilterEnabled: (e: FilterEnabled) => void
  sortCriteria: SortCriteria<T>
  fallbackSortCriterion?: SortCriterion<T>
  searchFields: SearchField<T>[]
  onNew?: () => void
  onOpenFilter?: () => void
  onOpenSort?: () => void
  newLabel?: string
  message?: string | undefined
  className?: string | undefined
};

export default function ItemList<T extends object>({
  items,
  Item,
  filterNames,
  filterEnabled,
  onFilterEnabled,
  sortCriteria,
  fallbackSortCriterion,
  searchFields,
  onNew,
  onOpenFilter,
  onOpenSort,
  newLabel = 'New',
  message,
  className,
}: Props<T>) {
  const {
    searched,
    searchText,
    setSearchText,
  } = useSearch(items, searchFields);

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
        <div className={styles['header-controls']}>
          <div className={styles['menus']}>
            <FilterMenu
              names={filterNames}
              enabled={filterEnabled}
              onEnabledChange={onFilterEnabled}
              onOpen={onOpenFilter ?? null}
            />

            <SortMenu
              names={sortNames}
              criteriaOrder={sortCriteriaOrder}
              setCriteriaOrder={setSortCriteriaOrder}
              direction={sortDirection}
              setDirection={setSortDirection}
              onOpen={onOpenSort ?? null}
            />
          </div>

          <TextInput
            label="Search"
            placeholder="Search"
            icon={searchIcon}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            hideLabel
          />

          {onNew && (
            <button
              type="button"
              onClick={onNew}
              className={`${btnStyles['btn']} ${btnStyles['solid']}`}
            >
              <FontAwesomeIcon icon={addIcon} className={btnStyles['icon'] ?? ''} />
              {newLabel}
            </button>
          )}
        </div>
        {message && <div className={styles['message']}>{message}</div>}
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
