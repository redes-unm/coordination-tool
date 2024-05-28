import { Task, taskPriorityDisplayNames, taskStatusDisplayNames } from '@/types';
import { useContext, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck, faCircleHalfStroke, faClipboard, faExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays, faCircle } from '@fortawesome/free-regular-svg-icons';
import { throwErr } from '@/lib/util';
import CommunityContext from '@/contexts/CommunityContext';
import styles from './TaskDisplay.module.css';

type Props = {
  item: Task
};

export default function TaskDisplay({ item: task }: Props) {
  const { campaigns } = useContext(CommunityContext);

  const date = useMemo(() => {
    if (!task.date) {
      return 'No due date';
    }

    const d = task.date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'utc',
    });

    return `Due ${d}`;
  }, [task.date]);

  const statusIcon = useMemo(() => {
    switch (task.status) {
      case 'done':
        return faCircleCheck;
      case 'in progress':
        return faCircleHalfStroke;
      case 'todo':
        return faCircle;
      default:
        return faCircle;
    }
  }, [task.status]);

  const campaign = useMemo(
    () => campaigns.find((c) => c.id === task.campaignId) ?? throwErr('missing campaign'),
    [campaigns, task.campaignId],
  );

  return (
    <div className={styles['container']}>
      <div className={styles['details']}>
        <div className={`${styles['detail']} ${styles['campaign'] ?? ''}`}>
          <FontAwesomeIcon icon={faClipboard} className={styles['icon'] ?? ''} />
          {`Campaign: ${campaign.name}`}
        </div>

        <div className={`${styles['detail']} ${styles['date'] ?? ''}`}>
          <FontAwesomeIcon icon={faCalendarDays} className={styles['icon'] ?? ''} />
          {date}
        </div>

        <div className={`${styles['detail']} ${styles['status'] ?? ''}`}>
          <FontAwesomeIcon icon={statusIcon} className={styles['icon'] ?? ''} />
          {taskStatusDisplayNames[task.status]}
        </div>

        <div className={`${styles['detail']} ${styles['priority'] ?? ''}`}>
          <span className={styles['icon']}>
            {task.priority !== 'low' && <FontAwesomeIcon icon={faExclamation} />}
            {task.priority === 'high' && <FontAwesomeIcon icon={faExclamation} />}
          </span>
          {taskPriorityDisplayNames[task.priority]}
        </div>
      </div>

      {task.description && (
        <div className={styles['description']}>
          {task.description}
        </div>
      )}
    </div>
  );
}
