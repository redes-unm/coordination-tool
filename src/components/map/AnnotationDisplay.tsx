import { Annotation, annotationTypeDisplayNames } from '@/types';

type Props = {
  annotation: Annotation
};

export default function AnnotationDisplay({ annotation }: Props) {
  return (
    <div>
      <strong>{annotation.name}</strong>
      <div>{`(${annotationTypeDisplayNames[annotation.type]})`}</div>
      <div>
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
