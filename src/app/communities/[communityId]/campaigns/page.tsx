import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { Suspense } from 'react';
import CampaignList from '@/components/CampaignList';
import styles from './page.module.css';

export default function Campaigns() {
  return (
    <div className={styles['content']}>
      <h2 className={styles['title']}>
        <FontAwesomeIcon icon={faClipboard} />
        Campaigns
      </h2>
      <Suspense fallback="Loading...">
        <CampaignList className={styles['campaign-list']} />
      </Suspense>
    </div>
  );
}
