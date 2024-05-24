'use client';

import CommunityMap from '@/components/CommunityMap';
import { newDb } from '@/db/client';
import CommunityProvider from '@/contexts/CommunityProvider';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useAsyncResource } from '@/lib/AsyncResource';
import { useCallback, useState } from 'react';
import { withDbNotFound404 } from '@/lib/util';
import { CommunityPlus } from '@/contexts/CommunityContext';
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
  const [communityPromise, setCommunityPromise] = useState<Promise<CommunityPlus>>(
    () => withDbNotFound404(newDb().getCommunity(params.communityId)),
  );

  const community = useAsyncResource(useCallback(() => communityPromise, [communityPromise]));

  return community ? (
    <CommunityProvider
      value={{
        community,
        onCommunityUpdated: (c) => setCommunityPromise(Promise.resolve(c)),
      }}
    >
      { showMap ? (
        <div className={styles['panes']}>
          <div className={styles['content-pane']}>{children}</div>
          <div className={styles['map-pane']}>
            <CommunityMap
              initialAnnotations={community.annotations}
              initialLngLat={community.mapCenter}
              campaigns={community.campaigns}
              communityId={community.id}
            />
          </div>
        </div>
      ) : children }
    </CommunityProvider>
  ) : 'Loading...';
}
