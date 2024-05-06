import { CampaignWithCounts, campaignTypeDisplayNames } from '@/types';
import {
  faCalendarDays, faListCheck, faPencilRuler, faSchoolFlag, faStopwatch,
} from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import styles from './CampaignCard.module.css';

type Props = {
  item: CampaignWithCounts,
  className?: string | undefined
};

export default function CampaignCard({ item: campaign, className }: Props) {
  const typeIcon = useMemo(() => {
    switch (campaign.type) {
      case 'measurement':
        return faStopwatch;
      case 'education':
        return faSchoolFlag;
      case 'event':
        return faCalendarDays;
      default:
        return null;
    }
  }, [campaign.type]);

  return (
    <div className={`${styles['card']} ${className ?? ''}`}>
      <div className={styles['info']}>
        <div className={styles['name']}>{campaign.name}</div>
        <div>
          <div className={styles['description']}>{campaign.description}</div>
          <Link href={`/communities/${campaign.communityId}/campaigns/${campaign.id}`}>
            Read more
          </Link>
        </div>
        <div className={styles['details']}>
          <Link href={`?campaign=${campaign.id}`} className={styles['detail']}>
            <FontAwesomeIcon icon={faPencilRuler} />
            {`${campaign.annotationCount} annotations`}
          </Link>
          <div className={styles['detail']}>
            <FontAwesomeIcon icon={faListCheck} />
            {`${campaign.taskCount} tasks`}
          </div>
        </div>
      </div>
      <div className={styles['type']}>
        {typeIcon && <FontAwesomeIcon icon={typeIcon} />}
        {campaignTypeDisplayNames[campaign.type]}
      </div>
    </div>
  );
}
