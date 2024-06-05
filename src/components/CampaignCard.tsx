import { CampaignWithCounts, campaignTypeDisplayNames } from '@/types';
import {
  faCalendarDays, faListCheck, faPencilRuler, faSchoolFlag, faStopwatch,
} from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
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
        return faClipboard;
    }
  }, [campaign.type]);

  return (
    <Link
      href={`?campaign=${campaign.id}`}
      className={`${styles['card']} ${className ?? ''}`}
    >
      <div className={styles['info']}>
        <div className={styles['name']}>{campaign.name}</div>
        <div className={styles['description']}>{campaign.description}</div>
        <div className={styles['details']}>
          <Link href={`?campaignFilter=${campaign.id}`} className={styles['detail']}>
            <FontAwesomeIcon icon={faPencilRuler} />
            {`${campaign.annotationCount} annotations`}
          </Link>
          <Link
            href={`/communities/${campaign.communityId}/tasks?campaignFilter=${campaign.id}`}
            className={styles['detail']}
          >
            <FontAwesomeIcon icon={faListCheck} />
            {`${campaign.taskCount} tasks`}
          </Link>
        </div>
      </div>
      <div className={styles['type']}>
        {typeIcon && <FontAwesomeIcon icon={typeIcon} />}
        {campaignTypeDisplayNames[campaign.type]}
      </div>
    </Link>
  );
}
