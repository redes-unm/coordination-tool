import {
  Task, taskPriorityDisplayNames, taskStatusDisplayNames,
} from '@/types';
import { useContext, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { throwErr } from '@/lib/util';
import CommunityContext from '@/contexts/CommunityContext';
import {
  campaignsIcon,
  taskDateIcon,
  taskNoDateIcon,
  taskPriorityIcon,
  taskPriorityIconCount,
  taskStatusIcons,
} from '@/icons';
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

  const campaign = useMemo(
    () => campaigns.find((c) => c.id === task.campaignId) ?? throwErr('missing campaign'),
    [campaigns, task.campaignId],
  );

  return (
    <div className={styles['container']}>
      <div className={styles['details']}>
        <div className={`${styles['detail']} ${styles['campaign'] ?? ''}`}>
          <FontAwesomeIcon icon={campaignsIcon} className={styles['icon'] ?? ''} />
          {`Campaign: ${campaign.name}`}
        </div>

        <div className={`${styles['detail']} ${styles['date'] ?? ''}`}>
          <FontAwesomeIcon
            icon={task.date ? taskDateIcon : taskNoDateIcon}
            className={styles['icon'] ?? ''}
          />
          {date}
        </div>

        <div className={`${styles['detail']} ${styles['status'] ?? ''}`}>
          <FontAwesomeIcon
            icon={taskStatusIcons[task.status]}
            className={styles['icon'] ?? ''}
          />
          {taskStatusDisplayNames[task.status]}
        </div>

        <div className={`${styles['detail']} ${styles['priority'] ?? ''}`}>
          <span className={styles['icon']}>
            {
              new Array(taskPriorityIconCount[task.priority])
                .fill(taskPriorityIcon)
                // eslint-disable-next-line react/no-array-index-key -- what else is there?
                .map((icon, i) => <FontAwesomeIcon icon={icon} key={i} />)
            }
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
