import { Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TaskList from '@/components/TaskList';
import { tasksIcon } from '@/icons';
import styles from './page.module.css';

export default async function Tasks() {
  return (
    <div className={styles['content']}>
      <h2 className={styles['title']}>
        <FontAwesomeIcon icon={tasksIcon} />
        Tasks
      </h2>
      <Suspense fallback="Loading...">
        <TaskList className={styles['task-list']} />
      </Suspense>
    </div>
  );
}
