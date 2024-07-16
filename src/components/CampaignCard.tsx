import { Campaign, campaignTypeDisplayNames } from '@/types';
import { useContext, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import CommunityContext from '@/contexts/CommunityContext';
import { annotationsIcon, campaignTypeIcons, tasksIcon } from '@/icons';
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
            <FontAwesomeIcon icon={annotationsIcon} />
            {`${annotationCount} annotations`}
          </Link>
          <Link
            href={`/communities/${campaign.communityId}/tasks?campaignFilter=${campaign.id}`}
            className={styles['detail']}
          >
            <FontAwesomeIcon icon={tasksIcon} />
            {`${taskCount} tasks`}
          </Link>
        </div>
      </div>
      <div className={styles['type']}>
        <FontAwesomeIcon icon={campaignTypeIcons[campaign.type]} />
        {campaignTypeDisplayNames[campaign.type]}
      </div>
    </Link>
  );
}
