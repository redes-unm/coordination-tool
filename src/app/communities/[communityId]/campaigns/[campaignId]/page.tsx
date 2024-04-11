import getDb from '@/db/mockDB';
import { withDbNotFound404 } from '@/lib/util';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    communityId: string
    campaignId: string
  }
};

export default async function Campaign({ params }: Props) {
  const [
    community,
    campaign,
    tasks,
    annotationCount,
  ] = await withDbNotFound404(() => Promise.all([
    getDb().getCommunity(params.communityId),
    getDb().getCampaign(params.campaignId),
    getDb().getCampaignTasks(params.campaignId),
    getDb().getCampaignAnnotationCount(params.campaignId),
  ]));

  if (community.id !== campaign.communityId) {
    notFound();
  }

  return (
    <>
      <h2>Campaign Overview</h2>
      <ul>
        {tasks.map((t) => (
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
          <span>{annotationCount}</span>
        </Link>
      </div>
    </>
  );
}
