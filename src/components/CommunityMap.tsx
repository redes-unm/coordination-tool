'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Annotation, AnnotationWithCampaigns, annotationTypeDisplayNames, assertAnnotationType,
} from '@/types';
import { newDb } from '@/db/client';
import useFilter from '@/hooks/useFilter';
import useAutoCampaignFilter from '@/hooks/useAutoCampaignFilter';
import Map from './map/Map';

type Props = {
  initialAnnotations: AnnotationWithCampaigns[]
  communityId: string
  campaigns: { id: string, name: string }[]
};

export default function CommunityMap({
  initialAnnotations,
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
          match: (a: AnnotationWithCampaigns) => a.campaignIds.includes(campaign.id),
        },
      }), {}),
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
    setAnnotations((old) => old.concat({ ...annotation, campaignIds: [] }));
  }, [db, communityId]);

  const handleUpdateAnnotation = useCallback(async (annotation: Annotation) => {
    await db.upsertAnnotation(annotation, communityId);
    setAnnotations((old) => old.filter((a) => a.id !== annotation.id).concat({
      ...annotation,
      campaignIds: [],
    }));
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
    />
  );
}
