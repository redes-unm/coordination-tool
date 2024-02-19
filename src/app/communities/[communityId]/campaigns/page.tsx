import Page from '@/components/Page';
import getDb from '@/db/mockDB';
import { withDbNotFound404 } from '@/lib/util';
import Link from 'next/link';

type Props = {
  params: {
    communityId: string
  }
};

export default async function Campaigns({ params }: Props) {
  const [community, campaigns] = await withDbNotFound404(() => Promise.all([
    getDb().getCommunity(params.communityId),
    getDb().getCampaigns(params.communityId),
  ]));

  return (
    <Page community={community}>
      <h2>Community Campaigns</h2>
      { campaigns.map((c) => (
        <div key={c.id}>
          <Link href={`/communities/${params.communityId}/campaigns/${c.id}`}>
            {c.name}
          </Link>
        </div>
      ))}
    </Page>
  );
}
