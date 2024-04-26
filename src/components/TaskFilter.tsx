import * as Dropdown from '@radix-ui/react-dropdown-menu';
import {
  Campaign, Task, TaskPriority, TaskStatus,
  assertTaskPriority, assertTaskStatus, taskPriorityDisplayNames, taskStatusDisplayNames,
} from '@/types';
import btnStyles from '@/components/Button.module.css';
import menuStyles from '@/components/Menu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, faChevronDown, faChevronUp, faFilter,
} from '@fortawesome/free-solid-svg-icons';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';

type Props = {
  tasks: Task[]
  campaigns: Campaign[]
  onFiltered: (tasks: Task[]) => void
};

type CampaignFilters = { [id: string]: boolean };
type StatusFilters = { [s in TaskStatus]: boolean };
type PriorityFilters = { [p in TaskPriority]: boolean };

export default function TaskFilter({
  tasks,
  campaigns,
  onFiltered,
}: Props) {
  const [campaignFilters, setCampaignFilters] = useState<CampaignFilters>({});

  useEffect(() => setCampaignFilters((old) => ({
    ...campaigns.map((c) => c.id).reduce<{ [id: string]: boolean }>((filters, id) => ({
      ...filters,
      [id]: true,
    }), {}),
    ...old,
  })), [campaigns]);

  const [statusFilters, setStatusFilters] = useState<StatusFilters>({
    todo: true,
    'in progress': true,
    done: false,
  });

  const [priorityFilters, setPriorityFilters] = useState<PriorityFilters>({
    low: true,
    medium: true,
    high: true,
  });

  const toggleAllFilters = useCallback((f: boolean) => {
    setCampaignFilters(
      campaigns.map((c) => c.id).reduce<{ [id: string]: boolean }>((filters, id) => ({
        ...filters,
        [id]: f,
      }), {}),
    );

    setStatusFilters({
      todo: f,
      'in progress': f,
      done: f,
    });

    setPriorityFilters({
      low: f,
      medium: f,
      high: f,
    });
  }, [campaigns]);

  useEffect(() => {
    onFiltered(tasks.filter((t) => (
      campaignFilters[t.campaignId]
      && statusFilters[t.status]
      && priorityFilters[t.priority]
    )));
  }, [campaignFilters, statusFilters, priorityFilters, onFiltered, tasks]);

  const allTrue = useMemo(() => (
    Object.values(campaignFilters).every((v) => v)
    && Object.values(statusFilters).every((v) => v)
    && Object.values(priorityFilters).every((v) => v)
  ), [campaignFilters, statusFilters, priorityFilters]);

  const allFalse = useMemo(() => (
    Object.values(campaignFilters).every((v) => !v)
    && Object.values(statusFilters).every((v) => !v)
    && Object.values(priorityFilters).every((v) => !v)
  ), [campaignFilters, statusFilters, priorityFilters]);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger className={`${btnStyles['btn']} ${menuStyles['menu-btn']}`}>
        <span>
          <FontAwesomeIcon icon={faFilter} className={btnStyles['icon'] ?? ''} />
          Filter
        </span>
        <span className={menuStyles['menu-icon']}>
          <FontAwesomeIcon icon={faChevronDown} className={menuStyles['menu-icon-closed'] || ''} />
          <FontAwesomeIcon icon={faChevronUp} className={menuStyles['menu-icon-open'] || ''} />
        </span>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content className={menuStyles['menu-content']}>
          <Dropdown.Arrow className={menuStyles['menu-arrow']} />

          <Dropdown.Group>
            <Dropdown.Label className={menuStyles['menu-label']}>
              By priority
            </Dropdown.Label>
            {
                Object.entries(taskPriorityDisplayNames).map(([priority, name]) => {
                  assertTaskPriority(priority);
                  return (
                    <Dropdown.CheckboxItem
                      key={priority}
                      className={menuStyles['menu-item']}
                      checked={priorityFilters[priority] ?? false}
                      onCheckedChange={(checked) => setPriorityFilters((f) => ({
                        ...f,
                        [priority]: checked,
                      }))}
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                        <FontAwesomeIcon icon={faCheck} />
                      </Dropdown.ItemIndicator>
                      {name}
                    </Dropdown.CheckboxItem>
                  );
                })
              }
          </Dropdown.Group>

          <Dropdown.Separator className={menuStyles['separator']}>
            <hr />
          </Dropdown.Separator>

          <Dropdown.Group>
            <Dropdown.Label className={menuStyles['menu-label']}>
              By status
            </Dropdown.Label>
            {
                Object.entries(taskStatusDisplayNames).map(([status, name]) => {
                  assertTaskStatus(status);
                  return (
                    <Dropdown.CheckboxItem
                      key={status}
                      className={menuStyles['menu-item']}
                      checked={statusFilters[status] ?? false}
                      onCheckedChange={(checked) => setStatusFilters((f) => ({
                        ...f,
                        [status]: checked,
                      }))}
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                        <FontAwesomeIcon icon={faCheck} />
                      </Dropdown.ItemIndicator>
                      {name}
                    </Dropdown.CheckboxItem>
                  );
                })
              }
          </Dropdown.Group>

          <Dropdown.Separator className={menuStyles['separator']}>
            <hr />
          </Dropdown.Separator>

          <Dropdown.Group>
            <Dropdown.Label className={menuStyles['menu-label']}>
              By campaign
            </Dropdown.Label>
            {
                campaigns.map((c) => (
                  <Dropdown.CheckboxItem
                    key={c.id}
                    className={menuStyles['menu-item']}
                    checked={campaignFilters[c.id] ?? false}
                    onCheckedChange={(checked) => setCampaignFilters((f) => ({
                      ...f,
                      [c.id]: checked,
                    }))}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                      <FontAwesomeIcon icon={faCheck} />
                    </Dropdown.ItemIndicator>
                    {c.name}
                  </Dropdown.CheckboxItem>
                ))
              }
          </Dropdown.Group>

          <Dropdown.Separator className={menuStyles['separator']}>
            <hr />
          </Dropdown.Separator>

          <Dropdown.Item
            className={menuStyles['menu-item']}
            onClick={() => toggleAllFilters(true)}
            disabled={allTrue}
          >
            Show all
          </Dropdown.Item>

          <Dropdown.Item
            className={menuStyles['menu-item']}
            onClick={() => toggleAllFilters(false)}
            disabled={allFalse}
          >
            Hide all
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
