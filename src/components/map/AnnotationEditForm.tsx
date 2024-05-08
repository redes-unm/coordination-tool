import {
  Annotation, annotationTypeDisplayNames, assertAnnotationType,
} from '@/types';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import btnStyles from '@/components/Button.module.css';
import TextInput from '../TextInput';
import styles from './AnnotationEditForm.module.css';
import SelectMenu from '../SelectMenu';

type Props = {
  annotation: Annotation
  onSave: (a: Annotation) => Promise<void>
  onCancel: () => void
};

export default function AnnotationEditForm({
  annotation,
  onSave,
  onCancel,
}: Props) {
  const firstInput = useRef<{ focus:() => void }>(null);
  const [name, setName] = useState(annotation.name);
  const [description, setDescription] = useState(annotation.description);
  const [type, setType] = useState(annotation.type);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      await onSave({
        ...annotation,
        name,
        description,
        type,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
    }

    setLoading(false);
  }, [annotation, name, description, type, onSave]);

  useEffect(() => firstInput.current?.focus(), []);

  return (
    <form action={handleSubmit}>
      <div className={styles['inputs']}>
        <TextInput
          ref={firstInput}
          label="Name"
          id={`${annotation.id}-name-input`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          labelAbove
        />

        <SelectMenu
          options={Object.entries(annotationTypeDisplayNames)}
          id={`${annotation.id}-type-menu`}
          value={type}
          onValueChange={(t) => {
            assertAnnotationType(t);
            setType(t);
          }}
          label="Type"
          labelAbove
        />

        <TextInput
          label="Description"
          id={`${annotation.id}-desc-input`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiLine
          labelAbove
        />
      </div>
      {error && <div className={`error ${styles['error']}`}>{error}</div>}
      <div className={styles['btns']}>
        <button
          type="submit"
          disabled={loading}
          className={`${btnStyles['btn']} ${btnStyles['solid']}`}
        >
          { loading ? 'Saving...' : 'Save' }
        </button>
        <button type="button" onClick={onCancel} className={btnStyles['btn']}>
          Cancel
        </button>
      </div>
    </form>
  );
}
