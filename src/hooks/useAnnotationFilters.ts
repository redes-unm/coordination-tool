import { Annotation, AnnotationType } from '@/types';
import { useMemo, useState } from 'react';

export type AnnotationFilters = { [T in AnnotationType]: boolean };

export default function useAnnotationFilters(allAnnotations: Annotation[]): {
  filteredAnnotations: Annotation[],
  filters: AnnotationFilters
  setFilters: (filters: AnnotationFilters) => void,
} {
  const [annotationFilters, setAnnotationFilters] = useState<AnnotationFilters>({
    infra: true,
    equipment: true,
    person: true,
    poi: true,
    region: true,
  });

  const filteredAnnotations = useMemo(
    () => allAnnotations.filter((a) => annotationFilters[a.type]),
    [allAnnotations, annotationFilters],
  );

  return {
    filteredAnnotations,
    filters: annotationFilters,
    setFilters: setAnnotationFilters,
  };
}
