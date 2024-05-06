'use client';

import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  Annotation, AnnotationWithCampaigns, annotationTypeDisplayNames, assertAnnotationType,
} from '@/types';
import { newDb } from '@/db/client';
import useFilter, { FilterEnabled } from '@/hooks/useFilter';
import { useSearchParams } from 'next/navigation';
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
  const selectedCampaignId = useSearchParams().get('campaign');
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);
    if (selectedCampaign) {
      setMessage(`Filtered to campaign ${selectedCampaign.name}.`);
      setFilterEnabled((old) => ({
        ...old,
        campaign: campaigns.reduce((enabled, campaign) => ({
          ...enabled,
          [campaign.id]: campaign.id === selectedCampaign.id,
        }), {}),
      }));
    } else {
      setMessage('');
    }
  }, [selectedCampaignId, setFilterEnabled, campaigns]);

  const handleFilterEnabled = useCallback((e: FilterEnabled) => {
    setMessage('');
    setFilterEnabled(e);
  }, [setFilterEnabled]);

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
