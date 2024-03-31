'use client';

import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faUser } from '@fortawesome/free-solid-svg-icons';
import { usePathname, useRouter } from 'next/navigation';
import { isLoggedIn, logOut } from '@/lib/auth/client';
import { useAsyncResource } from '@/lib/AsyncResource';
import Link from 'next/link';
import menuStyles from './Menu.module.css';
import btnStyles from './Button.module.css';
import styles from './AccountMenu.module.css';

export default function AccountMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const loggedIn = useAsyncResource(isLoggedIn);

  const handleLogOut = async () => {
    await logOut();
    router.push('/auth/login');
  };

  return loggedIn ? (
    <Dropdown.Root>
      <Dropdown.Trigger className={`${btnStyles['btn']} ${btnStyles['solid']} ${menuStyles['menu-btn']}`}>
        <span>
          <FontAwesomeIcon icon={faUser} />
          {' '}
          Account
        </span>
        <span className={menuStyles['menu-icon']}>
          <FontAwesomeIcon icon={faChevronDown} className={menuStyles['menu-icon-closed'] || ''} />
          <FontAwesomeIcon icon={faChevronUp} className={menuStyles['menu-icon-open'] || ''} />
        </span>
      </Dropdown.Trigger>

      <Dropdown.Portal>
        <Dropdown.Content className={menuStyles['menu-content']}>
          <Dropdown.Arrow className={menuStyles['menu-arrow']} />
          <Dropdown.Item className={menuStyles['menu-item']}>Settings</Dropdown.Item>
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
