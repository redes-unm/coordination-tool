import {
  Task, assertTaskPriority, assertTaskStatus, taskPriorityDisplayNames, taskStatusDisplayNames,
} from '@/types';
import React, { useContext, useMemo } from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import styles from './TaskEditFormContents.module.css';
import SelectMenu from './SelectMenu';
import TextInput from './TextInput';
import DateInput from './DateInput';

type Props = {
  item: Task
  onChange: (item: Task) => void
};

function TaskEditFormContents({
  item: task,
  onChange,
}: Props, ref: React.ForwardedRef<{ focus: () => void }>) {
  const { campaigns } = useContext(CommunityContext);

  return (
    <div className={styles['inputs']}>
      <TextInput
        ref={ref}
        label="Name"
        value={task.name}
        onChange={(e) => onChange({ ...task, name: e.target.value })}
        labelAbove
        required
      />

      <SelectMenu
        options={useMemo(
          () => campaigns.map<[string, string]>((c) => [c.id, c.name]),
          [campaigns],
        )}
        value={task.campaignId}
        onValueChange={(id) => onChange({ ...task, campaignId: id })}
        label="Campaign"
        labelAbove
      />

      <DateInput
        label="Due date"
        value={task.date}
        onChange={(d) => onChange({ ...task, date: d })}
        labelAbove
      />

      <SelectMenu
        options={Object.entries(taskStatusDisplayNames)}
        value={task.status}
        onValueChange={(s) => {
          assertTaskStatus(s);
          onChange({ ...task, status: s });
        }}
        label="Status"
        labelAbove
      />

      <SelectMenu
        options={Object.entries(taskPriorityDisplayNames)}
        value={task.priority}
        onValueChange={(p) => {
          assertTaskPriority(p);
          onChange({ ...task, priority: p });
        }}
        label="Priority"
        labelAbove
      />

      <TextInput
        label="Description"
        value={task.description}
        onChange={(e) => onChange({ ...task, description: e.target.value })}
        multiLine
        labelAbove
      />
    </div>
  );
}

export default React.forwardRef(TaskEditFormContents);
