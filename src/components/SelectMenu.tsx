'use client';

import * as Select from '@radix-ui/react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import menuStyles from './Menu.module.css';
import btnStyles from './Button.module.css';
import styles from './SelectMenu.module.css';

function isSimpleOptions(options: string[] | [string, string][]): options is string[] {
  return !Array.isArray(options[0]);
}

type Props = {
  options: string[] | [string, string][]
  id?: string
  value: string
  onValueChange: (val: string) => void
  label: string
  labelAbove?: boolean | undefined
  hideLabel?: boolean | undefined
};

export default function SelectMenu({
  options,
  id: propsId,
  value,
  onValueChange,
  label,
  labelAbove = false,
  hideLabel = false,
}: Props) {
  const [id, setId] = useState(propsId);
  useEffect(() => setId(propsId ?? uuid()), [propsId]);

  const opts = isSimpleOptions(options)
    ? options.map<[string, string]>((o) => ([o, o]))
    : options;

  return (
    <span className={`${styles['container']} ${labelAbove ? styles['above'] : ''}`}>
      { !hideLabel && (
        <label htmlFor={id}>{label}</label>
      )}
      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger
          className={`${btnStyles['btn']} ${menuStyles['menu-btn']} ${styles['select']}`}
          aria-label={hideLabel ? label : undefined}
        >
          <Select.Value />
          <Select.Icon className={menuStyles['menu-icon']}>
            <FontAwesomeIcon icon={faChevronDown} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className={`${menuStyles['menu-content']} ${menuStyles['select']}`}>
            <Select.Viewport>
              { opts.map(([val, display]) => (
                <Select.Item value={val} key={val} className={menuStyles['menu-item']}>
                  <Select.ItemText>{display}</Select.ItemText>
                </Select.Item>
              )) }
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </span>
  );
}
