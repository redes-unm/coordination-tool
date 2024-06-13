import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchoolFlag, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays, faClipboard } from '@fortawesome/free-regular-svg-icons';
import { Campaign, campaignTypeDisplayNames } from '@/types';
import styles from './CampaignDisplay.module.css';

type Props = {
  item: Campaign
};

export default function CampaignDisplay({ item: campaign }: Props) {
  const typeIcon = useMemo(() => {
    switch (campaign.type) {
      case 'measurement':
        return faStopwatch;
      case 'education':
        return faSchoolFlag;
      case 'event':
        return faCalendarDays;
      default:
        return faClipboard;
    }
  }, [campaign.type]);

  return (
    <div className={styles['container']}>
      <div className={styles['details']}>
        <div className={`${styles['detail']} ${styles['type'] ?? ''}`}>
          {typeIcon && <FontAwesomeIcon icon={typeIcon} className={styles['icon'] ?? ''} />}
          {campaignTypeDisplayNames[campaign.type]}
        </div>
      </div>

      {campaign.description && (
        <div className={styles['description']}>
          {campaign.description}
        </div>
      )}
    </div>
  );
}
