'use client';

import CommunityContext from '@/contexts/CommunityContext';
import { Suspense, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/free-solid-svg-icons';
import TaskList from '@/components/TaskList';
import styles from './page.module.css';

export default function Tasks() {
  const community = useContext(CommunityContext);

  return (
    <div className={styles['content']}>
      <h2 className={styles['title']}>
        <FontAwesomeIcon icon={faTasks} />
        Tasks
      </h2>
      <Suspense fallback="Loading...">
        <TaskList community={community} className={styles['task-list']} />
      </Suspense>
    </div>
  );
}
