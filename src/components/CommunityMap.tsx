'use client';

import { useCallback, useState } from 'react';
import { Annotation } from '@/types';
import Map from './map/Map';

type Props = {
  initialAnnotations: Annotation[]
};

export default function CommunityMap({
  initialAnnotations,
}: Props) {
  const [annotations, setAnnotations] = useState(initialAnnotations);

  const handleAddAnnotation = useCallback((annotation: Annotation) => {
    setAnnotations((old) => [...old, annotation]);
  }, []);

  const handleDeleteAnnotation = useCallback((annotation: Annotation) => {
    setAnnotations((old) => old.filter((a) => a.id !== annotation.id));
  }, []);

  return (
    <Map
      annotations={annotations}
      onAdd={handleAddAnnotation}
      onDelete={handleDeleteAnnotation}
    />
  );
}
