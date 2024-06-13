'use client';

import { newDb } from '@/db/client';
import {
  Task, assertTaskPriority, assertTaskStatus,
  taskPriorityDisplayNames, taskStatusDisplayNames,
} from '@/types';
import {
  useCallback, useContext, useMemo, useState,
} from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import useFilter from '@/hooks/useFilter';
import { SearchField } from '@/hooks/useSearch';
import { SortCriteria, SortCriterion } from '@/hooks/useSort';
import useAutoCampaignFilter from '@/hooks/useAutoCampaignFilter';
import useSearchParam from '@/hooks/useSearchParam';
import dynamic from 'next/dynamic';
import { v4 as uuid } from 'uuid';
import { throwErr } from '@/lib/util';
import TaskCard from './TaskCard';
import ItemList from './ItemList';

// for some reason the task dialog has issues with server-side rendering
const TaskDialog = dynamic(() => import('./TaskDialog'), { ssr: false });

type Props = {
  className?: string | undefined
};

export default function TaskList({ className }: Props) {
  const db = useMemo(() => newDb(), []);
  const { campaigns, tasks, onCommunityDataUpdated } = useContext(CommunityContext);
  const [newTask, setNewTask] = useState<Task | null>(null);
  const [openTaskId, setOpenTaskId] = useSearchParam('task');

  const openTask = useMemo(
    () => newTask ?? tasks.find((t) => t.id === openTaskId),
    [tasks, newTask, openTaskId],
  );

  const filter = useMemo(() => ({
    priority: {
      name: 'By priority',
      items: Object.entries(taskPriorityDisplayNames).reduce((items, [priority, name]) => {
        assertTaskPriority(priority);
        return {
          ...items,
          [priority]: { name, field: 'priority', value: priority },
        };
      }, {}),
    },
    status: {
      name: 'By status',
      items: Object.entries(taskStatusDisplayNames).reduce((items, [status, name]) => {
        assertTaskStatus(status);
        return {
          ...items,
          [status]: { name, field: 'status', value: status },
        };
      }, {}),
    },
    campaign: {
      name: 'By campaign',
      items: campaigns.reduce((items, campaign) => ({
        ...items,
        [campaign.id]: { name: campaign.name, field: 'campaignId', value: campaign.id },
      }), {}),
    },
  }), [campaigns]);

  const {
    filtered,
    filterNames,
    filterEnabled,
    setFilterEnabled,
  } = useFilter(tasks, filter);

  const { message, handleFilterEnabled } = useAutoCampaignFilter(
    setFilterEnabled,
    filter.campaign,
  );

  const sortCriteria: SortCriteria<Task> = useMemo(() => ({
    date: {
      name: 'Date',
      sort: (a: Task, b: Task) => {
        const aTime = a.date?.getTime() ?? Infinity;
        const bTime = b.date?.getTime() ?? Infinity;
        if (aTime === bTime) {
          return 0;
        }
        return aTime < bTime ? -1 : 1;
      },
      categories: [
        {
          name: 'Overdue',
          match: (t: Task) => t.status !== 'done' && !!t.date && t.date < new Date(),
        },
        {
          name: 'Upcoming',
          match: (t: Task) => t.status !== 'done' && !!t.date && t.date >= new Date(),
        },
        {
          name: 'Unscheduled',
          match: (t: Task) => t.status !== 'done' && !t.date,
        },
        {
          name: 'Completed',
          match: (t: Task) => t.status === 'done',
        },
      ],
    },
    priority: {
      name: 'Priority',
      field: 'priority',
      order: ['low', 'medium', 'high'],
      categories: Object.entries(taskPriorityDisplayNames).map(([priority, name]) => {
        assertTaskPriority(priority);
        return { name, field: 'priority', value: priority };
      }),
    },
    status: {
      name: 'Status',
      field: 'status',
      order: ['todo', 'in progress', 'done'],
      categories: Object.entries(taskStatusDisplayNames).map(([status, name]) => {
        assertTaskStatus(status);
        return { name, field: 'status', value: status };
      }),
    },
    campaign: {
      name: 'Campaign',
      field: 'campaignId',
      categories: campaigns.map((c) => ({ name: c.name, field: 'campaignId', value: c.id })),
    },
  }), [campaigns]);

  const fallbackSortCriterion: SortCriterion<Task> = useMemo(() => ({
    name: 'Name',
    field: 'name',
  }), []);

  const searchFields: SearchField<Task>[] = useMemo(() => ['name', 'description'], []);

  const handleNew = useCallback(() => setNewTask({
    id: uuid(),
    name: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    date: null,
    campaignId: campaigns.find((c) => c.default)?.id ?? throwErr('no default campaign!'),
  }), [campaigns]);

  const handleSaveTask = useCallback(async (task: Task) => {
    if (newTask) {
      await db.insertTask(task);
      setNewTask(null);
    } else {
      await db.updateTask(task);
    }

    onCommunityDataUpdated({ tasks: tasks.filter((t) => t.id !== task.id).concat(task) });
  }, [db, newTask, tasks, onCommunityDataUpdated]);

  const handleDeleteTask = useCallback(async (id: string) => {
    await db.deleteTask(id);
    onCommunityDataUpdated({ tasks: tasks.filter((t) => t.id !== id) });
  }, [db, tasks, onCommunityDataUpdated]);

  return (
    <>
      <ItemList
        items={filtered}
        Item={TaskCard}
        filterNames={filterNames}
        filterEnabled={filterEnabled}
        onFilterEnabled={handleFilterEnabled}
        message={message}
        sortCriteria={sortCriteria}
        fallbackSortCriterion={fallbackSortCriterion}
        searchFields={searchFields}
        onNew={handleNew}
        className={className}
      />
      <TaskDialog
        task={openTask}
        editing={openTask === newTask}
        title={openTask === newTask ? 'New task' : undefined}
        closeOnCancel={openTask === newTask}
        onClose={useCallback(() => {
          setOpenTaskId(null);
          setNewTask(null);
        }, [setOpenTaskId])}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </>
  );
}
