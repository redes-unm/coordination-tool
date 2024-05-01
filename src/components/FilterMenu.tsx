import * as Dropdown from '@radix-ui/react-dropdown-menu';
import btnStyles from '@/components/Button.module.css';
import menuStyles from '@/components/Menu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, faChevronDown, faChevronUp, faFilter,
} from '@fortawesome/free-solid-svg-icons';
import {
  Fragment,
  useCallback, useEffect, useMemo, useState,
} from 'react';

type ValueFilterDef<T extends object> = {
  [K in keyof T] : { name: string, field: K, value: T[K] }
}[keyof T];

function valueFilterMatch<T extends object>(def: ValueFilterDef<T>, t: T): boolean {
  return t[def.field] === def.value;
}

type FunctionFilterDef<T> = { name: string, match: (t: T) => boolean };

function functionFilterMatch<T>(def: FunctionFilterDef<T>, t: T): boolean {
  return def.match(t);
}

export type FilterDef<T> = FunctionFilterDef<T> | (T extends object ? ValueFilterDef<T> : never);

function filterMatch<T>(def: FilterDef<T>, t: T): boolean {
  return 'match' in def ? functionFilterMatch(def, t) : valueFilterMatch(def, t);
}

export type FilterGroupDef<T> = {
  defs: FilterDef<T>[]
  header?: string
};

type Props<T> = {
  items: T[]
  filters: FilterGroupDef<T>[]
  onFiltered: (items: T[]) => void
  label?: string
};

export default function FilterMenu<T extends object>({
  items,
  filters,
  onFiltered,
  label = 'Filter',
}: Props<T>) {
  const [enabled, setEnabled] = useState<boolean[][]>([]);

  const getEnabled = useCallback(
    (groupIndex: number, index: number) => enabled[groupIndex]?.[index] ?? true,
    [enabled],
  );

  const setAllEnabled = useCallback(
    (value: boolean) => setEnabled(filters.map((g) => g.defs.map(() => value))),
    [filters],
  );

  useEffect(() => setAllEnabled(true), [filters, setAllEnabled]);

  useEffect(() => {
    onFiltered(items.filter((item) => (
      filters.every((group, gi) => (
        group.defs.some((def, i) => getEnabled(gi, i) && filterMatch(def, item))
      ))
    )));
  }, [onFiltered, filters, getEnabled, items]);

  const allEnabled = useMemo(() => enabled.every((g) => g.every((f) => f)), [enabled]);
  const allDisabled = useMemo(() => enabled.every((g) => g.every((f) => !f)), [enabled]);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger className={`${btnStyles['btn']} ${menuStyles['menu-btn']}`}>
        <span>
          <FontAwesomeIcon icon={faFilter} className={btnStyles['icon'] ?? ''} />
          {label}
        </span>
        <span className={menuStyles['menu-icon']}>
          <FontAwesomeIcon icon={faChevronDown} className={menuStyles['menu-icon-closed'] || ''} />
          <FontAwesomeIcon icon={faChevronUp} className={menuStyles['menu-icon-open'] || ''} />
        </span>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content className={menuStyles['menu-content']}>
          <Dropdown.Arrow className={menuStyles['menu-arrow']} />

          { filters.map((group, gi) => (
            <Fragment
              // eslint-disable-next-line react/no-array-index-key
              key={gi}
            >
              <Dropdown.Group>
                { group.header && (
                  <Dropdown.Label className={menuStyles['menu-label']}>
                    {group.header}
                  </Dropdown.Label>
                )}

                { group.defs.map((def, i) => (
                  <Dropdown.CheckboxItem
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    className={menuStyles['menu-item']}
                    checked={getEnabled(gi, i)}
                    onCheckedChange={(checked) => setEnabled((old) => {
                      const n = [...old];
                      const groupEnabled = n[gi] ?? [];
                      groupEnabled[i] = checked;
                      n[gi] = groupEnabled;
                      return n;
                    })}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                      <FontAwesomeIcon icon={faCheck} />
                    </Dropdown.ItemIndicator>
                    {def.name}
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
            onClick={() => setAllEnabled(true)}
            disabled={allEnabled}
          >
            Show all
          </Dropdown.Item>

          <Dropdown.Item
            className={menuStyles['menu-item']}
            onClick={() => setAllEnabled(false)}
            disabled={allDisabled}
          >
            Hide all
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
