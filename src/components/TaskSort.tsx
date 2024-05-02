import {
  Campaign, Task, assertTaskPriority, assertTaskStatus,
  taskPriorityDisplayNames, taskStatusDisplayNames,
} from '@/types';
import { useMemo } from 'react';
import SortMenu, { Category, SortDef } from './SortMenu';

type Props = {
  tasks: Task[]
  campaigns: Campaign[]
  onSorted: (categories: Category<Task>[]) => void
};

export default function TaskSort({
  tasks,
  campaigns,
  onSorted,
}: Props) {
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

  return (
    <SortMenu
      items={tasks}
      sortDefs={sortDefs}
      fallbackSortDef={fallbackSortDef}
      onSorted={onSorted}
    />
  );
}
