'use client';

import { useCallback, useMemo, useState } from 'react';
import { Annotation } from '@/types';
import Map from './map/Map';

type Props = {
  initialAnnotations: Annotation[]
};

export default function CommunityMap({
  initialAnnotations,
}: Props) {
  const [annotations, setAnnotations] = useState(initialAnnotations);
  const initialLngLat = useMemo<[number, number]>(() => [-84.396, 33.777], []);

  const handleAddAnnotation = useCallback((annotation: Annotation) => {
    setAnnotations((old) => [...old, annotation]);
  }, []);

  const handleDeleteAnnotation = useCallback((annotation: Annotation) => {
    setAnnotations((old) => old.filter((a) => a.id !== annotation.id));
  }, []);

  return (
    <Map
      initialLngLat={initialLngLat}
      initialZoom={12}
      annotations={annotations}
      onAdd={handleAddAnnotation}
      onDelete={handleDeleteAnnotation}
    />
  );
}
