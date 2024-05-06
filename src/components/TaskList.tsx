'use client';

import { newDb } from '@/db/client';
import { useAsyncResource } from '@/lib/AsyncResource';
import {
  Task, assertTaskPriority, assertTaskStatus,
  taskPriorityDisplayNames, taskStatusDisplayNames,
} from '@/types';
import { useCallback, useContext, useMemo } from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import useFilter, { Filter } from '@/hooks/useFilter';
import { SearchField } from '@/hooks/useSearch';
import { SortCriteria, SortCriterion } from '@/hooks/useSort';
import useAutoCampaignFilter from '@/hooks/useAutoCampaignFilter';
import TaskCard from './TaskCard';
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

  const filter: Filter<Task> = useMemo(() => ({
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

  const { message, handleFilterEnabled } = useAutoCampaignFilter(setFilterEnabled, campaigns);

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
    priority: {
      name: 'Priority',
      field: 'priority',
      order: ['low', 'medium', 'high'],
      categoryDefs: Object.entries(taskPriorityDisplayNames).map(([priority, name]) => {
        assertTaskPriority(priority);
        return { name, field: 'priority', value: priority };
      }),
    },
    status: {
      name: 'Status',
      field: 'status',
      order: ['todo', 'in progress', 'done'],
      categoryDefs: Object.entries(taskStatusDisplayNames).map(([status, name]) => {
        assertTaskStatus(status);
        return { name, field: 'status', value: status };
      }),
    },
    campaign: {
      name: 'Campaign',
      field: 'campaignId',
      categoryDefs: campaigns.map((c) => ({ name: c.name, field: 'campaignId', value: c.id })),
    },
  }), [campaigns]);

  const fallbackSortCriterion: SortCriterion<Task> = useMemo(() => ({
    name: 'Name',
    field: 'name',
  }), []);

  const searchFields: SearchField<Task>[] = useMemo(() => ['name', 'description'], []);

  return (
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
      className={className}
    />
  );
}
