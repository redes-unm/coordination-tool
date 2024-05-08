'use client';

import { useCallback, useMemo, useState } from 'react';
import { Annotation } from '@/types';
import { newDb } from '@/db/client';
import Map from './map/Map';

type Props = {
  initialAnnotations: Annotation[]
  communityId: string
};

export default function CommunityMap({
  initialAnnotations,
  communityId,
}: Props) {
  const db = useMemo(() => newDb(), []);
  const [annotations, setAnnotations] = useState(initialAnnotations);

  const handleAddAnnotation = useCallback(async (annotation: Annotation) => {
    await db.insertAnnotation(annotation, communityId);
    setAnnotations((old) => old.concat(annotation));
  }, [db, communityId]);

  const handleUpdateAnnotation = useCallback(async (annotation: Annotation) => {
    await db.upsertAnnotation(annotation, communityId);
    setAnnotations((old) => old.filter((a) => a.id !== annotation.id).concat(annotation));
  }, [db, communityId]);

  const handleDeleteAnnotation = useCallback(async (id: string) => {
    await db.deleteAnnotation(id);
    setAnnotations((old) => old.filter((a) => a.id !== id));
  }, [db]);

  return (
    <Map
      annotations={annotations}
      onAdd={handleAddAnnotation}
      onUpdate={handleUpdateAnnotation}
      onDelete={handleDeleteAnnotation}
    />
  );
}
