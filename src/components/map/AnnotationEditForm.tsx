import {
  Annotation, annotationTypeDisplayNames, assertAnnotationType,
} from '@/types';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import TextInput from '../TextInput';

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
  const typeSelectId = `${annotation.id}-type-select`;
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
      <div>
        <TextInput
          ref={firstInput}
          label="Name"
          id={`${annotation.id}-name-input`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
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

        <label htmlFor={typeSelectId}>
          Type
          <select
            id={typeSelectId}
            value={type}
            onChange={(e) => {
              assertAnnotationType(e.target.value);
              setType(e.target.value);
            }}
          >
            { Object.entries(annotationTypeDisplayNames).map(([t, n]) => (
              <option value={t} key={t}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <div>{error}</div>
      <button type="submit" disabled={loading}>
        { loading ? 'Saving...' : 'Save' }
      </button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
