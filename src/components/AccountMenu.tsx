'use client';

import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname, useRouter } from 'next/navigation';
import { logOut } from '@/lib/auth/client';
import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';
import { useContext } from 'react';
import { menuClosedIcon, menuOpenIcon, userIcon } from '@/icons';
import menuStyles from './Menu.module.css';
import btnStyles from './Button.module.css';
import styles from './AccountMenu.module.css';

export default function AccountMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, reset } = useContext(AuthContext);

  const handleLogOut = async () => {
    await logOut();
    router.push('/auth/login');
    reset();
  };

  return user ? (
    <Dropdown.Root>
      <Dropdown.Trigger className={`${btnStyles['btn']} ${btnStyles['solid']} ${menuStyles['menu-btn']}`}>
        <span>
          <FontAwesomeIcon icon={userIcon} />
          {' '}
          Account
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
          <Dropdown.Label className={menuStyles['menu-label']}>
            {user.name ?? user.email ?? 'Unknown user'}
          </Dropdown.Label>
          <Dropdown.Item className={menuStyles['menu-item']} onClick={handleLogOut}>Log out</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  ) : (
    <Link
      className={`${btnStyles['btn']} ${btnStyles['solid']} ${menuStyles['menu-btn']} ${styles['login-link']}`}
      href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
    >
      Log in
    </Link>
  );
}
