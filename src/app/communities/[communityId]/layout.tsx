'use client';

import CommunityMap from '@/components/CommunityMap';
import { newDb } from '@/db/client';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useAsyncResource } from '@/lib/AsyncResource';
import { withDbNotFound404 } from '@/lib/util';
import { CommunityProvider } from '@/contexts/CommunityContext';
import { useCallback } from 'react';
import styles from './layout.module.css';

type Props = {
  params: { communityId: string }
};

export default function CommunityLayout({
  params,
  children,
}: React.PropsWithChildren<Props>) {
  const nextSegment = useSelectedLayoutSegment();
  const showMap = nextSegment !== 'edit';
  const data = useAsyncResource(useCallback(() => withDbNotFound404(
    newDb().getCommunityData(params.communityId),
  ), [params.communityId]));

  return data ? (
    <CommunityProvider initialData={data}>
      { showMap ? (
        <div className={styles['panes']}>
          <div className={styles['content-pane']}>{children}</div>
          <div className={styles['map-pane']}>
            <CommunityMap />
          </div>
        </div>
      ) : children }
    </CommunityProvider>
  ) : 'Loading...';
}
