'use client';

import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import AuthContext from '@/contexts/AuthContext';
import { isLoggedIn } from '@/lib/auth/client';
import { BreadcrumbProvider } from '@/contexts/BreadcrumbContext';
import { TrackingProvider } from '@/contexts/TrackingContext';
import AccountMenu from './AccountMenu';
import Breadcrumb from './Breadcrumb';
import LanguageMenu from './LanguageMenu';
import styles from './Page.module.css';

type Props = React.PropsWithChildren<{}>;

export default function Page({ children }: Props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const recheckLoggedIn = useCallback(async () => setLoggedIn(await isLoggedIn()), []);
  useEffect(() => { recheckLoggedIn(); }, [recheckLoggedIn]);

  /* NOTE for now we are just initializing the tracking store to an empty array,
   * which means the tracking store persists until we refresh the page.
   * This should be sufficient for now, since there shouldn't be a reason why
   * we need to see what's already stored in the db.
   *
   * TODO: figure out best mechanism for saving the tracking store to the db.
   */

  return (
    <div className={styles['page']}>
      <TrackingProvider initialStore={[]}>
        <AuthContext.Provider
          value={useMemo(() => ({
            loggedIn,
            reset: recheckLoggedIn,
          }), [loggedIn, recheckLoggedIn])}
        >
          <BreadcrumbProvider>
            <header className={styles['header']}>
              <h1 className={styles['title']}>Coordination Tool</h1>
              <nav className={styles['menus']}>
                <LanguageMenu />
                <AccountMenu />
              </nav>
              <Breadcrumb className={styles['breadcrumb']} />
            </header>
            <main className={styles['main']}>{children}</main>
          </BreadcrumbProvider>
        </AuthContext.Provider>
      </TrackingProvider>
    </div>
  );
}
