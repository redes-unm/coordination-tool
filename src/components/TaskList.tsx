import { newDb } from '@/db/client';
import { useAsyncResource } from '@/lib/AsyncResource';
import { Community, Task } from '@/types';
import { useCallback, useMemo, useState } from 'react';
import styles from './TaskList.module.css';
import TaskCard from './TaskCard';
import TaskFilter from './TaskFilter';
import TaskSort from './TaskSort';
import { Category } from './SortMenu';
import SearchBox from './SearchBox';

type Props = {
  community: Community
  campaigns: { id: string, name: string }[]
  className?: string | undefined
};

export default function TaskList({
  community,
  campaigns,
  className,
}: Props) {
  const tasks = useAsyncResource(
    useCallback(() => newDb().getCommunityTasks(community.id), [community.id]),
  ) ?? [];

  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [categories, setCategories] = useState<Category<Task>[]>([]);
  const [searchedTasks, setSearchedTasks] = useState<Task[]>(tasks);

  return (
    <div className={`${styles['container']} ${className ?? ''}`}>
      <div className={styles['header']}>
        <div className={styles['menus']}>
          <TaskFilter
            tasks={tasks}
            campaigns={campaigns}
            onFiltered={setFilteredTasks}
          />

          <TaskSort
            tasks={searchedTasks}
            campaigns={campaigns}
            onSorted={setCategories}
          />
        </div>
        <SearchBox
          items={filteredTasks}
          searchFields={useMemo(() => ['name', 'description'], [])}
          onSearched={setSearchedTasks}
        />
      </div>
      <div className={styles['list']}>
        {
          categories.map(({ name, items: catTasks }) => (
            <div className={styles['category']} key={name}>
              {name && <h3>{name}</h3>}
              {catTasks.map((t) => <TaskCard task={t} key={t.id} className={styles['task']} />)}
            </div>
          ))
        }
      </div>
    </div>
  );
}
