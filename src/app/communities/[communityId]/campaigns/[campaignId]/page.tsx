import { newDb } from '@/db/server';
import { withDbNotFound404 } from '@/lib/util';
import Link from 'next/link';

type Props = {
  params: {
    communityId: string
    campaignId: string
  }
};

export default async function Campaign({ params }: Props) {
  const db = newDb();
  const campaign = await withDbNotFound404(db.getCampaign(params.campaignId));

  return (
    <>
      <h2>Campaign Overview</h2>
      <ul>
        {campaign.tasks.map((t) => (
          <li key={t.id}>
            <div>{t.name}</div>
            <div>{t.status}</div>
            <div>{t.priority}</div>
          </li>
        ))}
      </ul>
      <div>
        <Link href={`/communities/${params.communityId}/campaigns/${campaign.id}/annotations`}>
          <span>Annotations</span>
          <span>{campaign.annotations.length}</span>
        </Link>
      </div>
    </>
  );
}
