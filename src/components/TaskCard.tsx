import { Task } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, faCircleCheck, faCircleHalfStroke, faExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendar, faCalendarDays, faCircle } from '@fortawesome/free-regular-svg-icons';
import { useMemo } from 'react';
import styles from './TaskCard.module.css';

type Props = {
  task: Task
};

export default function TaskCard({ task }: Props) {
  const date = useMemo(
    () => (task.date
      ? task.date.getFullYear() === (new Date().getFullYear())
        ? task.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : task.date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'No Date'),
    [task.date],
  );

  return (
    <div className={styles['card']}>
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
              icon={
                task.status === 'done' ? faCircleCheck
                  : task.status === 'in progress' ? faCircleHalfStroke
                    : faCircle
              }
            />
            {
              task.status === 'done' ? 'Completed'
                : task.status === 'in progress' ? 'In progress'
                  : 'Not started'
            }
          </div>
          <div className={styles['priority']}>
            <div className={styles['icon']}>
              {task.priority !== 'low' && <FontAwesomeIcon icon={faExclamation} />}
              {task.priority === 'high' && <FontAwesomeIcon icon={faExclamation} />}
            </div>
            {
              task.priority === 'low' ? 'Low piority'
                : task.priority === 'high' ? 'High priority'
                  : 'Normal priority'
            }
          </div>
        </div>
      </div>
    </div>
  );
}
