import { Campaign, campaignTypeDisplayNames } from '@/types';
import {
  faCalendarDays, faListCheck, faPencilRuler, faSchoolFlag, faStopwatch,
} from '@fortawesome/free-solid-svg-icons';
import { useContext, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import CommunityContext from '@/contexts/CommunityContext';
import styles from './CampaignCard.module.css';

type Props = {
  item: Campaign,
  className?: string | undefined
};

export default function CampaignCard({ item: campaign, className }: Props) {
  const { annotations, tasks } = useContext(CommunityContext);

  const annotationCount = useMemo(
    () => annotations.filter((a) => a.campaignIds.includes(campaign.id)).length,
    [campaign.id, annotations],
  );

  const taskCount = useMemo(
    () => tasks.filter((t) => t.campaignId === campaign.id).length,
    [campaign.id, tasks],
  );

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
            {`${annotationCount} annotations`}
          </Link>
          <Link
            href={`/communities/${campaign.communityId}/tasks?campaignFilter=${campaign.id}`}
            className={styles['detail']}
          >
            <FontAwesomeIcon icon={faListCheck} />
            {`${taskCount} tasks`}
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
