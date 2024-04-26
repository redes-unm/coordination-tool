import * as Dropdown from '@radix-ui/react-dropdown-menu';
import {
  Campaign, Task, taskPriorityDisplayNames, taskStatusDisplayNames,
} from '@/types';
import btnStyles from '@/components/Button.module.css';
import menuStyles from '@/components/Menu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightArrowLeft,
  faCheck, faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { throwErr } from '@/lib/util';

type Props = {
  tasks: Task[]
  campaigns: Campaign[]
  onSorted: (categories: Category[]) => void
};

export type Category = {
  name: string
  tasks: Task[]
};

type SortField = 'date' | 'priority' | 'status' | 'campaign';
const sortFields: SortField[] = ['date', 'priority', 'status', 'campaign'];

function sortTasks(
  tasks: Task[],
  campaigns: Campaign[],
  sort: SortField[],
  ascending: boolean,
) {
  const campaignMap = campaigns.reduce<{ [id: string]: Campaign }>((map, c) => ({
    ...map,
    [c.id]: c,
  }), {});

  const lt = ascending ? -1 : 1;
  const gt = lt * -1;
  const eq = 0;

  tasks.sort((a, b) => {
    // the linter says a for (const field of sort) {} loop requires pulling in a
    // heavyweight runtime, so avoid it
    for (let i = 0; i < sort.length; i += 1) {
      const field = sort[i];
      let aTime; let bTime; let aCampaign; let bCampaign;
      switch (field) {
        case 'date':
          aTime = a[field]?.getTime() ?? Infinity;
          bTime = b[field]?.getTime() ?? Infinity;
          if (aTime !== bTime) {
            return aTime < bTime ? lt : gt;
          }
          break;
        case 'priority':
          if (a[field] !== b[field]) {
            switch (a[field]) {
              case 'low':
                return lt;
              case 'medium':
                return b[field] === 'high' ? lt : gt;
              case 'high':
                return gt;
              default:
                // the linter wants this case
            }
          }
          break;
        case 'status':
          if (a[field] !== b[field]) {
            switch (a[field]) {
              case 'todo':
                return lt;
              case 'in progress':
                return b[field] === 'done' ? lt : gt;
              case 'done':
                return gt;
              default:
                // the linter wants this case
            }
          }
          break;
        case 'campaign':
          aCampaign = campaignMap[a.campaignId]?.name;
          bCampaign = campaignMap[b.campaignId]?.name;
          if (aCampaign && bCampaign && aCampaign !== bCampaign) {
            return aCampaign < bCampaign ? lt : gt;
          }
          break;
        default:
          throw Error(`unknown sort field: ${field}`);
      }
    }

    if (a.name === b.name) {
      return eq;
    }

    return a.name < b.name ? lt : gt;
  });

  return tasks;
}

export default function TaskSort({
  tasks,
  campaigns,
  onSorted,
}: Props) {
  const [sort, setSort] = useState<SortField[]>(['date', 'priority', 'status', 'campaign']);
  const [ascending, setAscending] = useState(true);

  useEffect(() => {
    const sorted = sortTasks(tasks, campaigns, sort, ascending);
    const main = sort[0] ?? throwErr('no sort fields!');

    let categoryFilters: { name: string, fn: (t: Task) => boolean }[] = [];
    const now = new Date();
    switch (main) {
      case 'date':
        categoryFilters = [
          { name: 'Overdue', fn: (t: Task) => t.status !== 'done' && !!t.date && t.date < now },
          { name: 'Upcoming', fn: (t: Task) => t.status !== 'done' && !!t.date && t.date >= now },
          { name: 'Unscheduled', fn: (t: Task) => t.status !== 'done' && !t.date },
          { name: 'Completed', fn: (t: Task) => t.status === 'done' },
        ];
        break;
      case 'priority':
        categoryFilters = Object.entries(taskPriorityDisplayNames).map(([priority, name]) => ({
          name,
          fn: (t: Task) => t.priority === priority,
        }));
        break;
      case 'status':
        categoryFilters = Object.entries(taskStatusDisplayNames).map(([status, name]) => ({
          name,
          fn: (t: Task) => t.status === status,
        }));
        break;
      case 'campaign':
        categoryFilters = campaigns.map((c) => ({
          name: c.name,
          fn: (t: Task) => t.campaignId === c.id,
        }));
        break;
      default:
        throw Error(`unknown sort field: ${main}`);
    }

    const categories = categoryFilters
      .map((f) => ({ name: f.name, tasks: sorted.filter(f.fn) }))
      .filter((f) => f.tasks.length > 0);
    onSorted(ascending ? categories : categories.reverse());
  }, [sort, ascending, tasks, campaigns, onSorted]);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger className={`${btnStyles['btn']} ${menuStyles['menu-btn']}`}>
        <span>
          <FontAwesomeIcon
            icon={faArrowRightArrowLeft}
            className={btnStyles['icon'] ?? ''}
            style={{ transform: 'rotate(90deg)' }}
          />
          Sort
        </span>
        <span className={menuStyles['menu-icon']}>
          <FontAwesomeIcon icon={faChevronDown} className={menuStyles['menu-icon-closed'] || ''} />
          <FontAwesomeIcon icon={faChevronUp} className={menuStyles['menu-icon-open'] || ''} />
        </span>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content className={menuStyles['menu-content']}>
          <Dropdown.Arrow className={menuStyles['menu-arrow']} />

          <Dropdown.RadioGroup value={sort[0] ?? ''}>
            <Dropdown.Label className={menuStyles['menu-label']}>
              Field
            </Dropdown.Label>
            {
                sortFields.map((field) => (
                  <Dropdown.RadioItem
                    key={field}
                    className={menuStyles['menu-item']}
                    value={field}
                    onSelect={(e) => {
                      e.preventDefault();
                      setSort([field, ...sortFields.filter((f) => f !== field)]);
                    }}
                  >
                    <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                      <FontAwesomeIcon icon={faCheck} />
                    </Dropdown.ItemIndicator>
                    {`${field[0]?.toUpperCase()}${field.substring(1)}`}
                  </Dropdown.RadioItem>
                ))
              }
          </Dropdown.RadioGroup>

          <Dropdown.Separator className={menuStyles['separator']}>
            <hr />
          </Dropdown.Separator>

          <Dropdown.RadioGroup value={ascending ? 'asc' : 'desc'}>
            <Dropdown.Label className={menuStyles['menu-label']}>
              Order
            </Dropdown.Label>
            <Dropdown.RadioItem
              className={menuStyles['menu-item']}
              value="asc"
              onSelect={(e) => {
                e.preventDefault();
                setAscending(true);
              }}
            >
              <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                <FontAwesomeIcon icon={faCheck} />
              </Dropdown.ItemIndicator>
              Ascending
            </Dropdown.RadioItem>
            <Dropdown.RadioItem
              className={menuStyles['menu-item']}
              value="desc"
              onSelect={(e) => {
                e.preventDefault();
                setAscending(false);
              }}
            >
              <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                <FontAwesomeIcon icon={faCheck} />
              </Dropdown.ItemIndicator>
              Descending
            </Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
