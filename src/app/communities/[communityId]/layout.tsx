import CommunityMap from '@/components/CommunityMap';
import { newDb } from '@/db/server';
import { withDbNotFound404 } from '@/lib/util';
import CommunityProvider from '@/contexts/CommunityProvider';
import styles from './layout.module.css';

type Props = {
  params: { communityId: string }
};

export default async function CommunityLayout({
  params,
  children,
}: React.PropsWithChildren<Props>) {
  const db = newDb();
  const community = await withDbNotFound404(db.getCommunity(params.communityId));

  return (
    <CommunityProvider value={community}>
      <div className={styles['panes']}>
        <div className={styles['content-pane']}>{children}</div>
        <div className={styles['map-pane']}>
          <CommunityMap
            initialAnnotations={community.annotations}
            campaigns={community.campaigns}
            communityId={community.id}
          />
        </div>
      </div>
    </CommunityProvider>
  );
}
