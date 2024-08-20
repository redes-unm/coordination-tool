import * as Dropdown from '@radix-ui/react-dropdown-menu';
import btnStyles from '@/components/Button.module.css';
import menuStyles from '@/components/Menu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useMemo } from 'react';
import {
  FilterEnabled, FilterNames, toggleAllEnabled, toggleSingleEnabled,
} from '@/hooks/useFilter';
import { throwErr } from '@/lib/util';
import {
  checkIcon, filterIcon, menuClosedIcon, menuOpenIcon,
} from '@/icons';

type Props = {
  names: FilterNames
  enabled: FilterEnabled
  onEnabledChange: (e: FilterEnabled) => void
  label?: string
  onOpen?: (() => void) | null
  onChange?: (() => void) | null
};

export default function FilterMenu({
  names,
  enabled,
  onEnabledChange,
  label = 'Filter',
  onOpen,
  onChange,
}: Props) {
  const allEnabled = useMemo(() => (
    Object.values(enabled).every((group) => Object.values(group).every((item) => item))
  ), [enabled]);

  const allDisabled = useMemo(() => (
    Object.values(enabled).every((group) => Object.values(group).every((item) => !item))
  ), [enabled]);

  const openMenu = (open: boolean) => {
    if (open && onOpen) onOpen();
  };

  // for when we click hide/show all
  const handleClick = (status: boolean) => {
    if (onChange) onChange();
    onEnabledChange(toggleAllEnabled(enabled, status));
  };

  // for when we change filter selection
  const handleSelect = (e: Event) => {
    if (onChange) onChange();
    e.preventDefault();
  };

  return (
    <Dropdown.Root onOpenChange={openMenu}>
      <Dropdown.Trigger className={`${btnStyles['btn']} ${menuStyles['menu-btn']}`}>
        <span>
          <FontAwesomeIcon icon={filterIcon} className={btnStyles['icon'] ?? ''} />
          {label}
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

          { Object.entries(names).map(([groupId, group]) => (
            <Fragment key={groupId}>
              <Dropdown.Group>
                { group.name && (
                  <Dropdown.Label className={menuStyles['menu-label']}>
                    {group.name}
                  </Dropdown.Label>
                )}

                { Object.entries(group.items).map(([itemId, itemName]) => (
                  <Dropdown.CheckboxItem
                    key={itemId}
                    className={menuStyles['menu-item']}
                    checked={enabled[groupId]?.[itemId] ?? throwErr('missing enabled')}
                    onCheckedChange={(checked) => onEnabledChange(
                      toggleSingleEnabled(enabled, groupId, itemId, checked),
                    )}
                    onSelect={handleSelect}
                  >
                    <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                      <FontAwesomeIcon icon={checkIcon} />
                    </Dropdown.ItemIndicator>
                    {itemName}
                  </Dropdown.CheckboxItem>
                ))}
              </Dropdown.Group>

              <Dropdown.Separator className={menuStyles['separator']}>
                <hr />
              </Dropdown.Separator>
            </Fragment>
          ))}

          <Dropdown.Item
            className={menuStyles['menu-item']}
            onClick={() => handleClick(true)}
            disabled={allEnabled}
          >
            Show all
          </Dropdown.Item>

          <Dropdown.Item
            className={menuStyles['menu-item']}
            onClick={() => handleClick(false)}
            disabled={allDisabled}
          >
            Hide all
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
