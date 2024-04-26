import debounce from 'debounce';
import { newDb } from '@/db/client';
import { useAsyncResource } from '@/lib/AsyncResource';
import { Community, Task } from '@/types';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './TaskList.module.css';
import TaskCard from './TaskCard';
import TaskFilter from './TaskFilter';
import TaskSort, { Category } from './TaskSort';
import TextInput from './TextInput';

type Props = {
  community: Community
  className?: string | undefined
};

export default function TaskList({
  community,
  className,
}: Props) {
  const [campaigns, tasks] = useAsyncResource(useCallback(() => {
    const db = newDb();
    return Promise.all([db.getCampaigns(community.id), db.getCommunityTasks(community.id)]);
  }, [community.id])) ?? [[], []];

  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchedTasks, setSearchedTasks] = useState<Task[]>(tasks);

  const updateSearchedTasks = useMemo(() => debounce((
    filtered: Task[],
    text: string,
  ) => {
    const searched = filtered.filter((t) => (
      t.name.toLowerCase().includes(text.toLowerCase())
      || t.description.toLowerCase().includes(text.toLowerCase())
    ));
    setSearchedTasks(searched);
  }, 300), []);

  useEffect(
    () => updateSearchedTasks(filteredTasks, searchText),
    [filteredTasks, searchText, updateSearchedTasks],
  );

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
        <TextInput
          label="Search"
          id="task-search"
          placeholder="Search"
          icon={faSearch}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          hideLabel
        />
      </div>
      <div className={styles['list']}>
        {
          categories.map(({ name, tasks: catTasks }) => (
            <div className={styles['category']} key={name}>
              <h3>{name}</h3>
              {catTasks.map((t) => <TaskCard task={t} key={t.id} className={styles['task']} />)}
            </div>
          ))
        }
      </div>
    </div>
  );
}
