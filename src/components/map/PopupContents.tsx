import { Annotation, annotationTypeDisplayNames, assertAnnotationType } from '@/types';
import { useEffect, useRef, useState } from 'react';

type Props = {
  annotation: Annotation
  onSave?: ((a: Annotation) => void) | undefined
  onDelete?: (() => void) | undefined
};

export default function PopupContents({
  annotation: initialAnnotation,
  onSave,
  onDelete,
}: Props) {
  const form = useRef<HTMLFormElement>(null);
  const firstInput = useRef<HTMLInputElement>(null);
  const [annotation, setAnnotation] = useState(initialAnnotation);

  useEffect(() => firstInput.current?.focus(), []);

  const nameInputId = `${annotation.id}-name-input`;
  const typeSelectId = `${annotation.id}-type-select`;

  return (
    <>
      {
        onSave ? (
          <form ref={form} onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor={nameInputId}>
                Name
                <input
                  id={nameInputId}
                  type="text"
                  value={annotation.name}
                  onChange={(e) => setAnnotation((a) => ({ ...a, name: e.target.value }))}
                  required
                  ref={firstInput}
                />
              </label>
              <label htmlFor={typeSelectId}>
                Type
                <select
                  id={typeSelectId}
                  onChange={(e) => setAnnotation((a) => {
                    assertAnnotationType(e.target.value);
                    return { ...a, type: e.target.value };
                  })}
                >
                  { Object.entries(annotationTypeDisplayNames).map(([type, name]) => (
                    <option value={type} key={type}>{name}</option>
                  ))}
                </select>
              </label>
            </div>
            <button type="submit" onClick={() => form.current?.reportValidity() && onSave(annotation)}>Save</button>
          </form>
        ) : (
          <div>
            <strong>{annotation.name}</strong>
            <div>{`(${annotationTypeDisplayNames[annotation.type]})`}</div>
          </div>
        )
      }
      {onDelete && <button type="button" onClick={onDelete}>Delete</button>}
    </>
  );
}
