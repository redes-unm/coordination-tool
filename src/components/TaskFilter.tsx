import {
  Campaign, Task, assertTaskPriority, assertTaskStatus,
  taskPriorityDisplayNames, taskStatusDisplayNames,
} from '@/types';
import { useMemo } from 'react';
import FilterMenu, { FilterGroupDef } from './FilterMenu';

type Props = {
  tasks: Task[]
  campaigns: Campaign[]
  onFiltered: (tasks: Task[]) => void
};

export default function TaskFilter({
  tasks,
  campaigns,
  onFiltered,
}: Props) {
  const filters: FilterGroupDef<Task>[] = useMemo(() => [
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

  return <FilterMenu items={tasks} filters={filters} onFiltered={onFiltered} />;
}
