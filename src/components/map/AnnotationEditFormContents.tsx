import {
  Annotation, annotationTypeDisplayNames, assertAnnotationType,
} from '@/types';
import React, { ChangeEvent, useCallback } from 'react';
import TextInput from '../TextInput';
import styles from './AnnotationEditFormContents.module.css';
import SelectMenu from '../SelectMenu';

type Props = {
  item: Annotation
  onChange: (a: Annotation) => void
};

function AnnotationEditFormContents({
  item: annotation,
  onChange,
}: Props, ref: React.ForwardedRef<{ focus: () => void }>) {
  return (
    <div className={styles['inputs']}>
      <TextInput
        ref={ref}
        label="Name"
        value={annotation.name}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => {
          onChange({ ...annotation, name: e.target.value });
        }, [annotation, onChange])}
        required
        labelAbove
      />

      <SelectMenu
        options={Object.entries(annotationTypeDisplayNames)}
        value={annotation.type}
        onValueChange={useCallback((t) => {
          assertAnnotationType(t);
          onChange({ ...annotation, type: t });
        }, [annotation, onChange])}
        label="Type"
        labelAbove
      />

      <TextInput
        label="Description"
        value={annotation.description}
        onChange={useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
          onChange({ ...annotation, description: e.target.value });
        }, [annotation, onChange])}
        multiLine
        labelAbove
      />
    </div>
  );
}

export default React.forwardRef(AnnotationEditFormContents);
