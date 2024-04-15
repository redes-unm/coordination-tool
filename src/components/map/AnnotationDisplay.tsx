import { Annotation, annotationTypeDisplayNames } from '@/types';
import styles from './AnnotationDisplay.module.css';

type Props = {
  annotation: Annotation
};

export default function AnnotationDisplay({ annotation }: Props) {
  return (
    <div className={styles['container']}>
      <strong>{annotation.name}</strong>
      <div>{`Type: ${annotationTypeDisplayNames[annotation.type]}`}</div>
      <div className={styles['description']}>
        {
          annotation.description.split('\n')
            .filter((s) => !!s.trim())
            /* eslint-disable-next-line react/no-array-index-key --
               there's nothing else unique to use */
            .map((p, i) => <p key={i}>{p}</p>)
        }
      </div>
    </div>
  );
}
