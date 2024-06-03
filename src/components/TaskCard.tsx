import { Task, taskPriorityDisplayNames, taskStatusDisplayNames } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, faCircleCheck, faCircleHalfStroke, faExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendar, faCalendarDays, faCircle } from '@fortawesome/free-regular-svg-icons';
import { useMemo } from 'react';
import Link from 'next/link';
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

  return (
    <Link
      href={`?task=${task.id}`}
      className={`${styles['card']} ${className ?? ''}`}
    >
      <div className={styles['completion-indicator']}>
        {task.status === 'done' && <FontAwesomeIcon icon={faCheck} />}
      </div>
      <div className={styles['info']}>
        <div className={styles['name']}>{task.name}</div>
        <div className={styles['details']}>
          <div className={styles['due-date']}>
            <FontAwesomeIcon
              className={styles['icon'] ?? ''}
              icon={task.date ? faCalendarDays : faCalendar}
            />
            {date}
          </div>
          <div className={styles['status']}>
            <FontAwesomeIcon
              className={styles['icon'] ?? ''}
              icon={statusIcon}
            />
            { taskStatusDisplayNames[task.status] }
          </div>
          <div className={styles['priority']}>
            <div className={styles['icon']}>
              {task.priority !== 'low' && <FontAwesomeIcon icon={faExclamation} />}
              {task.priority === 'high' && <FontAwesomeIcon icon={faExclamation} />}
            </div>
            {taskPriorityDisplayNames[task.priority]}
          </div>
        </div>
      </div>
    </Link>
  );
}
