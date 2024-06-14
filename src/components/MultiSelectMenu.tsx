import * as Dropdown from '@radix-ui/react-dropdown-menu';
import btnStyles from '@/components/Button.module.css';
import menuStyles from '@/components/Menu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { checkIcon, menuClosedIcon, menuOpenIcon } from '@/icons';
import styles from './MultiSelectMenu.module.css';

type Props = {
  items: {
    id: string
    name: string
    selected: boolean
  }[]
  label: string
  onSelectedChange: (id: string, selected: boolean) => void
};

export default function MultiSelectMenu({
  items,
  label,
  onSelectedChange,
}: Props) {
  const [id, setId] = useState('');
  useEffect(() => setId(uuid()), []);

  const btnText = useMemo(
    () => items.filter((i) => i.selected).map((i) => i.name).join(', '),
    [items],
  );

  return (
    <div className={styles['container']}>
      <label htmlFor={id}>{label}</label>
      <Dropdown.Root>
        <Dropdown.Trigger
          className={`${btnStyles['btn']} ${menuStyles['menu-btn']} ${styles['btn']}`}
          id={id}
        >
          <span className={styles['btn-text']}>
            {btnText || '[none]'}
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

            { items.map((item) => (
              <Dropdown.CheckboxItem
                key={item.id}
                className={menuStyles['menu-item']}
                checked={item.selected}
                onCheckedChange={(checked) => onSelectedChange(item.id, checked)}
                onSelect={(e) => e.preventDefault()}
              >
                <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                  <FontAwesomeIcon icon={checkIcon} />
                </Dropdown.ItemIndicator>
                {item.name}
              </Dropdown.CheckboxItem>
            )) }
          </Dropdown.Content>
        </Dropdown.Portal>
      </Dropdown.Root>
    </div>
  );
}
