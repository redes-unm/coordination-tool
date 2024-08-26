import { useCallback } from 'react';
import { Task } from '@/types';
import * as Dialog from '@radix-ui/react-dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { closeIcon } from '@/icons';
import styles from './TaskDialog.module.css';
import TaskDisplay from './TaskDisplay';
import TaskEditFormContents from './TaskEditFormContents';
import EditableItemDisplay from './EditableItemDisplay';

type Props = {
  task: Task | undefined
  editing: boolean
  title?: string | undefined
  closeOnCancel?: boolean
  onClose: () => void
  onEdit: () => void
  onSave: (t: Task) => Promise<void>
  onDelete: (id: string) => Promise<void>
};

export default function TaskDialog({
  task,
  editing,
  title,
  closeOnCancel,
  onSave,
  onDelete,
  onClose,
  onEdit,
}: Props) {
  return (
    <Dialog.Root
      open={!!task}
      onOpenChange={useCallback((open) => open || onClose(), [onClose])}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles['overlay']} />
        <Dialog.Content className={styles['content']} aria-describedby={undefined}>
          {task && (
            <>
              <Dialog.Title className={styles['title']}>
                {title ?? `Task: ${task.name}`}
              </Dialog.Title>
              <EditableItemDisplay
                item={task}
                editing={editing}
                onSave={onSave}
                onDelete={() => onDelete(task.id)}
                onCancel={closeOnCancel ? onClose : () => {}}
                onEdit={onEdit}
                Display={TaskDisplay}
                EditFormContents={TaskEditFormContents}
              />
              <Dialog.Close className={styles['close']}>
                <FontAwesomeIcon icon={closeIcon} />
                <span className="a11y-only">Close</span>
              </Dialog.Close>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
