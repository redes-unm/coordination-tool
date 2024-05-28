import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { Suspense } from 'react';
import CampaignList from '@/components/CampaignList';
import { newDb } from '@/db/server';
import { withDbNotFound404 } from '@/lib/util';
import styles from './page.module.css';

type Props = {
  params: { communityId: string }
};

export default async function Campaigns({ params }: Props) {
  const db = newDb();
  const campaigns = await withDbNotFound404(db.getCampaigns(params.communityId));

  return (
    <div className={styles['content']}>
      <h2 className={styles['title']}>
        <FontAwesomeIcon icon={faClipboard} />
        Campaigns
      </h2>
      <Suspense fallback="Loading...">
        <CampaignList campaigns={campaigns} className={styles['campaign-list']} />
      </Suspense>
    </div>
  );
}
