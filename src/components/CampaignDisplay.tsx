import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Campaign, campaignTypeDisplayNames } from '@/types';
import { campaignTypeIcons } from '@/icons';
import styles from './CampaignDisplay.module.css';

type Props = {
  item: Campaign
};

export default function CampaignDisplay({ item: campaign }: Props) {
  return (
    <div className={styles['container']}>
      <div className={styles['details']}>
        <div className={`${styles['detail']} ${styles['type'] ?? ''}`}>
          <FontAwesomeIcon
            icon={campaignTypeIcons[campaign.type]}
            className={styles['icon'] ?? ''}
          />
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
