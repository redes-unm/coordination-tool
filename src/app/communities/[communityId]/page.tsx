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
    annotationCount,
  ] = await withDbNotFound404(() => Promise.all([
    getDb().getCommunity(params.communityId),
    getDb().getCampaignCount(params.communityId),
    getDb().getCommunityAnnotationCount(params.communityId),
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
          <span>{annotationCount}</span>
        </Link>
      </div>
    </Page>
  );
}
