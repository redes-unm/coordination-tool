import { Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/free-solid-svg-icons';
import TaskList from '@/components/TaskList';
import { newDb } from '@/db/server';
import { withDbNotFound404 } from '@/lib/util';
import styles from './page.module.css';

type Props = {
  params: { communityId: string }
};

export default async function Tasks({ params }: Props) {
  const db = newDb();
  const tasks = await withDbNotFound404(db.getCommunityTasks(params.communityId));

  return (
    <div className={styles['content']}>
      <h2 className={styles['title']}>
        <FontAwesomeIcon icon={faTasks} />
        Tasks
      </h2>
      <Suspense fallback="Loading...">
        <TaskList tasks={tasks} className={styles['task-list']} />
      </Suspense>
    </div>
  );
}
