import { Annotation } from '@/types';
import { useEffect, useRef, useState } from 'react';
import AnnotationEditForm from './AnnotationEditForm';
import AnnotationDisplay from './AnnotationDisplay';

type Props = {
  annotation: Annotation
  editing?: boolean | undefined
  onSave?: ((a: Annotation) => Promise<void>) | undefined
  onDelete?: ((id: string) => Promise<void>) | undefined
};

export default function PopupContents({
  annotation,
  onSave,
  onDelete,
  editing: initialEditing = false,
}: Props) {
  const firstInput = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(initialEditing);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => firstInput.current?.focus(), []);

  return editing && onSave ? (
    <AnnotationEditForm
      annotation={annotation}
      onSave={async (a) => {
        await onSave(a);
        setEditing(false);
      }}
      onCancel={() => setEditing(false)}
    />
  ) : (
    <>
      <AnnotationDisplay annotation={annotation} />
      <div>{error}</div>
      { onSave && <button type="button" onClick={() => setEditing(true)}>Edit</button> }
      { onDelete && (
        <button
          type="button"
          onClick={async () => {
            setLoading(true);
            setError('');

            try {
              await onDelete(annotation.id);
            } catch (e: unknown) {
              setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
            }

            setLoading(false);
          }}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      )}
    </>
  );
}
