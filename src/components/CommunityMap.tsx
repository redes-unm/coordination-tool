'use client';

import {
  useCallback, useContext, useMemo,
} from 'react';
import {
  Annotation, annotationTypeDisplayNames, assertAnnotationType,
} from '@/types';
import { newDb } from '@/db/client';
import useFilter from '@/hooks/useFilter';
import useAutoCampaignFilter from '@/hooks/useAutoCampaignFilter';
import CommunityContext from '@/contexts/CommunityContext';
import Map from './map/Map';

export default function CommunityMap() {
  const {
    community,
    campaigns,
    annotations,
    onCommunityDataUpdated,
  } = useContext(CommunityContext);

  const setAnnotations = useCallback((setter: (old: Annotation[]) => Annotation[]) => {
    onCommunityDataUpdated({ annotations: setter(annotations) });
  }, [annotations, onCommunityDataUpdated]);

  const db = useMemo(() => newDb(), []);

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

  const { message, handleFilterEnabled } = useAutoCampaignFilter(
    setFilterEnabled,
    filter.campaign,
  );

  const handleAddAnnotation = useCallback(async (annotation: Annotation) => {
    await db.insertAnnotation(annotation, community.id);
    setAnnotations((old) => old.concat(annotation));
  }, [db, community.id, setAnnotations]);

  const handleUpdateAnnotation = useCallback(async (annotation: Annotation) => {
    await db.upsertAnnotation(annotation, community.id);
    setAnnotations((old) => old.filter((a) => a.id !== annotation.id).concat(annotation));
  }, [db, community.id, setAnnotations]);

  const handleDeleteAnnotation = useCallback(async (id: string) => {
    await db.deleteAnnotation(id);
    setAnnotations((old) => old.filter((a) => a.id !== id));
  }, [db, setAnnotations]);

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
      initialLngLat={community.mapCenter}
    />
  );
}
