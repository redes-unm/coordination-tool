'use client';

import { CommunityListProvider } from '@/contexts/CommunityListContext';
import { newDb } from '@/db/client';
import { useAsyncResource } from '@/lib/AsyncResource';
import { withDbNotFound404 } from '@/lib/util';
import { useCallback } from 'react';

export default function CommunitiesLayout({ children }: React.PropsWithChildren<{}>) {
  const communities = useAsyncResource(useCallback(() => withDbNotFound404(
    newDb().getCommunities(),
  ), []));

  return communities ? (
    <CommunityListProvider initialData={communities}>
      {children}
    </CommunityListProvider>
  ) : 'Loading...';
}
