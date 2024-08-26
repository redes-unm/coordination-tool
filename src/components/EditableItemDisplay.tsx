import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import btnStyles from '@/components/Button.module.css';
import styles from './EditableItemDisplay.module.css';

type Props<T> = {
  item: T
  editing?: boolean | undefined
  onSave: (item: T) => Promise<void>
  onDelete: () => Promise<void>
  onCancel?: () => void,
  onEdit?: () => void,
  Display: React.FC<{ item: T }>
  EditFormContents: React.ForwardRefExoticComponent<{
    item: T,
    onChange: (item: T) => void
  } & React.RefAttributes<{ focus: () => void }>>
};

export default function EditableItemDisplay<T>({
  item: initialItem,
  editing: initialEditing,
  onSave,
  onDelete,
  onCancel,
  onEdit,
  Display,
  EditFormContents,
}: Props<T>) {
  const firstInput = useRef<HTMLInputElement>(null);
  const [item, setItem] = useState(initialItem);
  const [editing, setEditing] = useState(initialEditing);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => firstInput.current?.focus(), [editing]);
  useEffect(() => setItem(initialItem), [initialItem]);

  const doAsync = useCallback(async (fn: () => Promise<void>) => {
    setLoading(true);
    setError('');

    try {
      await fn();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
    }

    setLoading(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    await doAsync(() => onSave(item));
    setEditing(false);
  }, [doAsync, onSave, item]);

  const handleDelete = useCallback(() => doAsync(onDelete), [doAsync, onDelete]);

  const handleCancel = useCallback(() => {
    setItem(initialItem);
    setEditing(false);
    onCancel?.();
  }, [initialItem, onCancel]);

  const handleEdit = useCallback(() => {
    setEditing(true);
    onEdit?.();
  }, [onEdit]);

  return (
    <div>
      {editing ? (
        <form action={handleSubmit}>
          <EditFormContents ref={firstInput} item={item} onChange={setItem} />

          <div className={styles['buttons']}>
            <button
              type="submit"
              className={`${btnStyles['btn']} ${btnStyles['solid']}`}
              disabled={loading}
            >
              { loading ? 'Saving...' : 'Save' }
            </button>

            <button
              type="button"
              className={btnStyles['btn']}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <Display item={item} />

          <div className={styles['buttons']}>
            <button
              type="button"
              className={btnStyles['btn']}
              onClick={handleEdit}
              disabled={loading}
            >
              Edit
            </button>

            <button
              type="button"
              className={`${btnStyles['btn']} ${btnStyles['danger']}`}
              onClick={handleDelete}
              disabled={loading}
            >
              { loading ? 'Deleting...' : 'Delete' }
            </button>
          </div>
        </div>
      )}
      {error && <div className={`error ${styles['error']}`}>{error}</div>}
    </div>
  );
}
