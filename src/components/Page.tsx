'use client';

import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import AuthContext from '@/contexts/AuthContext';
import { isLoggedIn } from '@/lib/auth/client';
import AccountMenu from './AccountMenu';
import Breadcrumb from './Breadcrumb';
import LanguageMenu from './LanguageMenu';
import styles from './Page.module.css';

type Props = React.PropsWithChildren<{}>;

export default function Page({ children }: Props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const recheckLoggedIn = useCallback(async () => setLoggedIn(await isLoggedIn()), []);
  useEffect(() => { recheckLoggedIn(); }, [recheckLoggedIn]);

  return (
    <div className={styles['page']}>
      <AuthContext.Provider
        value={useMemo(() => ({
          loggedIn,
          reset: recheckLoggedIn,
        }), [loggedIn, recheckLoggedIn])}
      >
        <header className={styles['header']}>
          <h1 className={styles['title']}>Coordination Tool</h1>
          <nav className={styles['menus']}>
            <LanguageMenu />
            <AccountMenu />
          </nav>
          <Breadcrumb className={styles['breadcrumb']} />
        </header>
        <main className={styles['main']}>{children}</main>
      </AuthContext.Provider>
    </div>
  );
}
