import AccountMenu from './AccountMenu';
import Breadcrumb from './Breadcrumb';
import LanguageMenu from './LanguageMenu';
import styles from './Page.module.css';

type Props = React.PropsWithChildren<{
  community?: { id: string, name: string }
  campaign?: { id: string, name: string }
}>;

// Define shared Page structure here, rather than in the root layout, in order
// to get all of the route parameters.
//
// See https://github.com/vercel/next.js/discussions/49507.
export default async function Page({
  children,
  community,
  campaign,
}: Props) {
  return (
    <div className={styles['page']}>
      <header className={styles['header']}>
        <h1 className={styles['title']}>Coordination Tool</h1>
        <nav className={styles['menus']}>
          <LanguageMenu />
          <AccountMenu />
        </nav>
        <Breadcrumb className={styles['breadcrumb']} campaign={campaign} community={community} />
      </header>
      <main className={styles['main']}>{children}</main>
    </div>
  );
}
