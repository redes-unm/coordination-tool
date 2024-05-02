import TaskCard from '@/components/TaskCard';
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
        {campaign.tasks.map((t) => <TaskCard key={t.id} item={t} />)}
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
