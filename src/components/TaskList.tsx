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
import TaskSort from './TaskSort';
import TextInput from './TextInput';
import { Category } from './SortMenu';

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
