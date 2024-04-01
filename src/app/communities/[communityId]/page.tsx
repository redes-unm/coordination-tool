import CommunityMap from '@/components/CommunityMap';
import Page from '@/components/Page';
import getDb from '@/db/mockDB';
import { withDbNotFound404 } from '@/lib/util';
import Link from 'next/link';

type Props = {
  params: { communityId: string }
};

export default async function Community({ params }: Props) {
  const [
    community,
    campaignCount,
    annotations,
  ] = await withDbNotFound404(() => Promise.all([
    getDb().getCommunity(params.communityId),
    getDb().getCampaignCount(params.communityId),
    getDb().getCommunityAnnotations(params.communityId),
  ]));

  return (
    <Page community={community}>
      <h2>Community Overview</h2>
      <div>
        <Link href={`/communities/${community.id}/campaigns`}>
          <span>Campaigns</span>
          <span>{campaignCount}</span>
        </Link>
      </div>
      <div>
        <Link href={`/communities/${community.id}/annotations`}>
          <span>Annotations</span>
          <span>{annotations.length}</span>
        </Link>
      </div>
      <div style={{ height: '600px' }}>
        <CommunityMap initialAnnotations={annotations} />
      </div>
    </Page>
  );
}
