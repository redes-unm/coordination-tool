import * as Dropdown from '@radix-ui/react-dropdown-menu';
import btnStyles from '@/components/Button.module.css';
import menuStyles from '@/components/Menu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { throwErr } from '@/lib/util';
import { SortCriteriaOrder, SortDirection, SortNames } from '@/hooks/useSort';
import {
  checkIcon, menuClosedIcon, menuOpenIcon, sortIcon,
} from '@/icons';

type Props = {
  names: SortNames
  criteriaOrder: SortCriteriaOrder
  setCriteriaOrder: (o: SortCriteriaOrder) => void
  direction: SortDirection
  setDirection: (d: SortDirection) => void
  onOpen?: (() => void) | null
};

export default function SortMenu({
  names,
  criteriaOrder,
  setCriteriaOrder,
  direction,
  setDirection,
  onOpen,
}: Props) {
  const openMenu = (open: boolean) => {
    if (open && onOpen) onOpen();
  };

  return (
    <Dropdown.Root onOpenChange={openMenu}>
      <Dropdown.Trigger className={`${btnStyles['btn']} ${menuStyles['menu-btn']}`}>
        <span>
          <FontAwesomeIcon
            icon={sortIcon}
            className={btnStyles['icon'] ?? ''}
            style={{ transform: 'rotate(90deg)' }}
          />
          Sort
        </span>
        <span className={menuStyles['menu-icon']}>
          <FontAwesomeIcon
            icon={menuClosedIcon}
            className={menuStyles['menu-icon-closed'] || ''}
          />
          <FontAwesomeIcon
            icon={menuOpenIcon}
            className={menuStyles['menu-icon-open'] || ''}
          />
        </span>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content className={menuStyles['menu-content']}>
          <Dropdown.Arrow className={menuStyles['menu-arrow']} />

          <Dropdown.RadioGroup value={criteriaOrder[0] ?? throwErr('no criteria')}>
            <Dropdown.Label className={menuStyles['menu-label']}>
              Sort by
            </Dropdown.Label>
            {
                Object.keys(names).map((id) => (
                  <Dropdown.RadioItem
                    key={id}
                    className={menuStyles['menu-item']}
                    value={id}
                    onSelect={(e) => {
                      e.preventDefault();
                      setCriteriaOrder([id, ...criteriaOrder.filter((i) => i !== id)]);
                    }}
                  >
                    <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                      <FontAwesomeIcon icon={checkIcon} />
                    </Dropdown.ItemIndicator>
                    {names[id]}
                  </Dropdown.RadioItem>
                ))
              }
          </Dropdown.RadioGroup>

          <Dropdown.Separator className={menuStyles['separator']}>
            <hr />
          </Dropdown.Separator>

          <Dropdown.RadioGroup value={direction}>
            <Dropdown.Label className={menuStyles['menu-label']}>
              Order
            </Dropdown.Label>
            <Dropdown.RadioItem
              className={menuStyles['menu-item']}
              value="ascending"
              onSelect={(e) => {
                e.preventDefault();
                setDirection('ascending');
              }}
            >
              <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                <FontAwesomeIcon icon={checkIcon} />
              </Dropdown.ItemIndicator>
              Ascending
            </Dropdown.RadioItem>
            <Dropdown.RadioItem
              className={menuStyles['menu-item']}
              value="descending"
              onSelect={(e) => {
                e.preventDefault();
                setDirection('descending');
              }}
            >
              <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                <FontAwesomeIcon icon={checkIcon} />
              </Dropdown.ItemIndicator>
              Descending
            </Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
