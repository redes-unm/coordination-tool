import { Task, taskPriorityDisplayNames, taskStatusDisplayNames } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import Link from 'next/link';
import {
  checkIcon,
  taskDateIcon,
  taskNoDateIcon,
  taskPriorityIcon,
  taskPriorityIconCount,
  taskStatusIcons,
} from '@/icons';
import styles from './TaskCard.module.css';

type Props = {
  item: Task
  className?: string | undefined
};

export default function TaskCard({ item: task, className }: Props) {
  const date = useMemo(() => {
    if (!task.date) {
      return 'No Date';
    }

    return task.date.getFullYear() === (new Date().getFullYear())
      ? task.date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        timeZone: 'utc',
      })
      : task.date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'utc',
      });
  }, [task.date]);

  return (
    <Link
      href={`?task=${task.id}`}
      className={`${styles['card']} ${className ?? ''}`}
    >
      <div className={styles['completion-indicator']}>
        {task.status === 'done' && <FontAwesomeIcon icon={checkIcon} />}
      </div>
      <div className={styles['info']}>
        <div className={styles['name']}>{task.name}</div>
        <div className={styles['details']}>
          <div className={styles['due-date']}>
            <FontAwesomeIcon
              className={styles['icon'] ?? ''}
              icon={task.date ? taskDateIcon : taskNoDateIcon}
            />
            {date}
          </div>
          <div className={styles['status']}>
            <FontAwesomeIcon
              className={styles['icon'] ?? ''}
              icon={taskStatusIcons[task.status]}
            />
            { taskStatusDisplayNames[task.status] }
          </div>
          <div className={styles['priority']}>
            <div className={styles['icon']}>
              {
                new Array(taskPriorityIconCount[task.priority])
                  .fill(taskPriorityIcon)
                  // eslint-disable-next-line react/no-array-index-key -- what else is there?
                  .map((icon, i) => <FontAwesomeIcon icon={icon} key={i} />)
              }
            </div>
            {taskPriorityDisplayNames[task.priority]}
          </div>
        </div>
      </div>
    </Link>
  );
}
