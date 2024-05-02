'use client';

import { newDb } from '@/db/client';
import { useAsyncResource } from '@/lib/AsyncResource';
import {
  Task, assertTaskPriority, assertTaskStatus,
  taskPriorityDisplayNames, taskStatusDisplayNames,
} from '@/types';
import { useCallback, useContext, useMemo } from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import TaskCard from './TaskCard';
import { SortDef } from './SortMenu';
import { SearchField } from './SearchBox';
import { FilterGroupDef } from './FilterMenu';
import ItemList from './ItemList';

type Props = {
  className?: string | undefined
};

export default function TaskList({ className }: Props) {
  const community = useContext(CommunityContext);
  const { campaigns } = community;

  const tasks = useAsyncResource(
    useCallback(() => newDb().getCommunityTasks(community.id), [community.id]),
  ) ?? [];

  const filterDefs: FilterGroupDef<Task>[] = useMemo(() => [
    {
      defs: Object.entries(taskPriorityDisplayNames).map(([priority, name]) => {
        assertTaskPriority(priority);
        return { name, field: 'priority', value: priority };
      }),
      header: 'By priority',
    },
    {
      defs: Object.entries(taskStatusDisplayNames).map(([status, name]) => {
        assertTaskStatus(status);
        return { name, field: 'status', value: status };
      }),
      header: 'By priority',
    },
    {
      defs: campaigns.map((c) => ({ name: c.name, field: 'campaignId', value: c.id })),
      header: 'By campaign',
    },
  ], [campaigns]);

  const sortDefs: SortDef<Task>[] = useMemo(() => [
    {
      key: 'Date',
      sort: (a: Task, b: Task) => {
        const aTime = a.date?.getTime() ?? Infinity;
        const bTime = b.date?.getTime() ?? Infinity;
        if (aTime === bTime) {
          return 0;
        }
        return aTime < bTime ? -1 : 1;
      },
      categoryDefs: [
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
    {
      key: 'Priority',
      field: 'priority',
      order: ['low', 'medium', 'high'],
      categoryDefs: Object.entries(taskPriorityDisplayNames).map(([priority, name]) => {
        assertTaskPriority(priority);
        return { name, field: 'priority', value: priority };
      }),
    },
    {
      key: 'Status',
      field: 'status',
      order: ['todo', 'in progress', 'done'],
      categoryDefs: Object.entries(taskStatusDisplayNames).map(([status, name]) => {
        assertTaskStatus(status);
        return { name, field: 'status', value: status };
      }),
    },
    {
      key: 'Campaign',
      field: 'campaignId',
      categoryDefs: campaigns.map((c) => ({ name: c.name, field: 'campaignId', value: c.id })),
    },
  ], [campaigns]);

  const fallbackSortDef: SortDef<Task> = useMemo(() => ({
    key: 'Name',
    field: 'name',
  }), []);

  const searchFields: SearchField<Task>[] = useMemo(() => ['name', 'description'], []);

  return (
    <ItemList
      items={tasks}
      Item={TaskCard}
      filterDefs={filterDefs}
      sortDefs={sortDefs}
      fallbackSortDef={fallbackSortDef}
      searchFields={searchFields}
      className={className}
    />
  );
}
