import getDb from '@/db/mockDB';
import { withDbNotFound404 } from '@/lib/util';
import Link from 'next/link';

type Props = {
  params: {
    communityId: string
  }
};

export default async function Campaigns({ params }: Props) {
  const campaigns = await withDbNotFound404(() => getDb().getCampaigns(params.communityId));

  return (
    <>
      <h2>Community Campaigns</h2>
      { campaigns.map((c) => (
        <div key={c.id}>
          <Link href={`/communities/${params.communityId}/campaigns/${c.id}`}>
            {c.name}
          </Link>
        </div>
      ))}
    </>
  );
}
