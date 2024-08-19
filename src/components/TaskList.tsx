'use client';

import { newDb } from '@/db/client';
import {
  Task, assertTaskPriority, assertTaskStatus,
  taskPriorityDisplayNames, taskStatusDisplayNames,
} from '@/types';
import {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import TrackingContext from '@/contexts/TrackingContext';
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
  const {
    community,
    campaigns,
    tasks,
    onCommunityDataUpdated,
  } = useContext(CommunityContext);
  const [newTask, setNewTask] = useState<Task | null>(null);
  const [openTaskId, setOpenTaskId] = useSearchParam('task');

  const { handleTracking } = useContext(TrackingContext);
  const trackEvent = useCallback((element: string, event: string) => {
    const timestamp = new Date();
    handleTracking({
      event,
      element,
      timestamp,
      page: `Tasks-${community.id}`,
    });
  }, [community.id, handleTracking]);

  useEffect(() => {
    trackEvent('', 'page-mount');
    return () => {
      trackEvent('', 'page-unmount');
    };
  }, [trackEvent]);

  const openTask = useMemo(
    // TODO add trackEvent('task-dialog', 'open'); somewhere here?
    () => newTask ?? tasks.find((t) => t.id === openTaskId),
    [tasks, newTask, openTaskId],
  );

  useEffect(() => {
    if (openTask) {
      trackEvent(`task-dialog-${openTaskId || 'new'}`, 'open');
    }
  }, [openTask, openTaskId, trackEvent]);

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

  const handleNew = useCallback(() => {
    trackEvent('new-button', 'click');
    return setNewTask({
      id: uuid(),
      name: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      date: null,
      campaignId: campaigns.find((c) => c.default)?.id ?? throwErr('no default campaign!'),
    });
  }, [campaigns, trackEvent]);

  const handleSaveTask = useCallback(async (task: Task) => {
    trackEvent(`save-task-${task.id}`, 'click');
    if (newTask) {
      await db.insertTask(task);
      setNewTask(null);
    } else {
      await db.updateTask(task);
    }

    onCommunityDataUpdated({ tasks: tasks.filter((t) => t.id !== task.id).concat(task) });
    // TODO might have to reset openTaskId here
  }, [db, newTask, tasks, onCommunityDataUpdated, trackEvent]);

  const handleDeleteTask = useCallback(async (id: string) => {
    trackEvent(`delete-task-${id}`, 'click');
    await db.deleteTask(id);
    onCommunityDataUpdated({ tasks: tasks.filter((t) => t.id !== id) });
    // TODO might have to reset openTaskId here
  }, [db, tasks, onCommunityDataUpdated, trackEvent]);

  const handleClose = useCallback(() => {
    trackEvent(`task-dialog-${openTaskId || 'new'}`, 'close');
    setOpenTaskId(null);
    setNewTask(null);
  }, [openTaskId, setOpenTaskId, trackEvent]);

  const handleEdit = useCallback(() => {
    trackEvent(`task-edit-${openTaskId || 'new'}`, 'click');
  }, [openTaskId, trackEvent]);

  const handleOpenFilter = useCallback(() => {
    trackEvent('filter-tasks', 'open');
  }, [trackEvent]);

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
        onOpenFilter={handleOpenFilter}
      />
      <TaskDialog
        task={openTask}
        editing={openTask === newTask}
        title={openTask === newTask ? 'New task' : undefined}
        closeOnCancel={openTask === newTask}
        onClose={handleClose}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        onEdit={handleEdit}
      />
    </>
  );
}
