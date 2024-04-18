'use client';

import * as Select from '@radix-ui/react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import menuStyles from './Menu.module.css';
import btnStyles from './Button.module.css';

const languages = {
  en: 'English',
  es: 'Español',
};

export default function LanguageMenu() {
  return (
    <Select.Root defaultValue="en">
      <Select.Trigger className={`${btnStyles['btn']} ${menuStyles['menu-btn']}`} aria-label="language">
        <Select.Value />
        <Select.Icon className={menuStyles['menu-icon']}>
          <FontAwesomeIcon icon={faChevronDown} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className={menuStyles['menu-content']}>
          <Select.Viewport>
            { Object.entries(languages).map(([code, name]) => (
              <Select.Item value={code} key={code} className={menuStyles['menu-item']}>
                <Select.ItemText>{name}</Select.ItemText>
              </Select.Item>
            )) }
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
