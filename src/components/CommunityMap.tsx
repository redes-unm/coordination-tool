'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Annotation, annotationTypeDisplayNames, assertAnnotationType,
} from '@/types';
import { newDb } from '@/db/client';
import useFilter from '@/hooks/useFilter';
import useAutoCampaignFilter from '@/hooks/useAutoCampaignFilter';
import Map from './map/Map';

type Props = {
  initialAnnotations: Annotation[]
  initialLngLat: [number, number] | undefined
  communityId: string
  campaigns: { id: string, name: string }[]
};

export default function CommunityMap({
  initialAnnotations,
  initialLngLat,
  communityId,
  campaigns,
}: Props) {
  const db = useMemo(() => newDb(), []);
  const [annotations, setAnnotations] = useState(initialAnnotations);

  const filter = useMemo(() => ({
    type: {
      name: 'By type',
      items: Object.entries(annotationTypeDisplayNames).reduce((items, [type, name]) => {
        assertAnnotationType(type);
        return {
          ...items,
          [type]: { name, field: 'type', value: type },
        };
      }, {}),
    },
    campaign: {
      name: 'By campaign',
      items: campaigns.reduce((items, campaign) => ({
        ...items,
        [campaign.id]: {
          name: campaign.name,
          match: (a: Annotation) => !!a.campaignIds?.includes(campaign.id),
        },
      }), {
        none: {
          name: 'No campaign',
          match: (a: Annotation) => (a.campaignIds ?? []).length === 0,
        },
      }),
    },
  }), [campaigns]);

  const {
    filtered,
    filterNames,
    filterEnabled,
    setFilterEnabled,
  } = useFilter(annotations, filter);

  const { message, handleFilterEnabled } = useAutoCampaignFilter(setFilterEnabled, campaigns);

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
      annotations={filtered}
      filterNames={filterNames}
      filterEnabled={filterEnabled}
      onFilterEnabled={handleFilterEnabled}
      message={message}
      onAdd={handleAddAnnotation}
      onUpdate={handleUpdateAnnotation}
      onDelete={handleDeleteAnnotation}
      initialLngLat={initialLngLat}
    />
  );
}
