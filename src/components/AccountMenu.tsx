'use client';

import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './Menu.module.css';

export default function AccountMenu() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className={`${styles['menu-btn']} ${styles['solid']}`}>
        <span>
          <FontAwesomeIcon icon={faUser} />
          {' '}
          Account
        </span>
        <span className={styles['menu-icon']}>
          <FontAwesomeIcon icon={faChevronDown} className={styles['menu-icon-closed'] || ''} />
          <FontAwesomeIcon icon={faChevronUp} className={styles['menu-icon-open'] || ''} />
        </span>
      </Dropdown.Trigger>

      <Dropdown.Portal>
        <Dropdown.Content className={styles['menu-content']}>
          <Dropdown.Arrow className={styles['menu-arrow']} />
          <Dropdown.Item className={styles['menu-item']}>Settings</Dropdown.Item>
          <Dropdown.Item className={styles['menu-item']}>Logout</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
