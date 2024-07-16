import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Suspense } from 'react';
import CampaignList from '@/components/CampaignList';
import { campaignsIcon } from '@/icons';
import styles from './page.module.css';

export default async function Campaigns() {
  return (
    <div className={styles['content']}>
      <h2 className={styles['title']}>
        <FontAwesomeIcon icon={campaignsIcon} />
        Campaigns
      </h2>
      <Suspense fallback="Loading...">
        <CampaignList className={styles['campaign-list']} />
      </Suspense>
    </div>
  );
}
