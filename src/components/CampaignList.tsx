'use client';

import { v4 as uuid } from 'uuid';
import { newDb } from '@/db/client';
import {
  CampaignWithCounts, assertCampaignType, campaignTypeDisplayNames,
} from '@/types';
import {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import useFilter, { Filter } from '@/hooks/useFilter';
import { SearchField } from '@/hooks/useSearch';
import { SortCriteria } from '@/hooks/useSort';
import useSearchParam from '@/hooks/useSearchParam';
import CommunityContext from '@/contexts/CommunityContext';
import ItemList from './ItemList';
import CampaignCard from './CampaignCard';
import CampaignDialog from './CampaignDialog';

type Props = {
  campaigns: CampaignWithCounts[]
  className?: string | undefined
};

export default function CampaignList({
  campaigns: initialCampaigns,
  className,
}: Props) {
  const { community, onCommunityDataUpdated } = useContext(CommunityContext);
  const db = useMemo(() => newDb(), []);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [newCampaign, setNewCampaign] = useState<CampaignWithCounts | null>(null);
  const [openCampaignId, setOpenCampaignId] = useSearchParam('campaign');

  const openCampaign = useMemo(
    () => newCampaign ?? campaigns.find((c) => c.id === openCampaignId),
    [campaigns, newCampaign, openCampaignId],
  );

  const filter: Filter<CampaignWithCounts> = useMemo(() => ({
    type: {
      name: 'By type',
      items: Object.entries(campaignTypeDisplayNames).reduce((items, [type, name]) => {
        assertCampaignType(type);
        return {
          ...items,
          [type]: { name, field: 'type', value: type },
        };
      }, {}),
    },
  }), []);

  const {
    filtered,
    filterNames,
    filterEnabled,
    setFilterEnabled,
  } = useFilter(campaigns, filter);

  const sortCriteria: SortCriteria<CampaignWithCounts> = useMemo(() => ({
    name: {
      name: 'Name',
      field: 'name',
    },
    type: {
      name: 'Type',
      field: 'type',
      categories: Object.entries(campaignTypeDisplayNames)
        .map(([type, name]) => {
          assertCampaignType(type);
          return { name, field: 'type', value: type };
        }),
    },
  }), []);

  const searchFields: SearchField<CampaignWithCounts>[] = useMemo(() => ['name', 'description'], []);

  const handleNew = useCallback(() => setNewCampaign({
    id: uuid(),
    name: '',
    description: '',
    type: 'measurement',
    communityId: community.id,
    default: false,
    taskCount: 0,
    annotationCount: 0,
  }), [community.id]);

  const handleSaveCampaign = useCallback(async (campaign: CampaignWithCounts) => {
    if (newCampaign) {
      await db.insertCampaign(campaign);
      setNewCampaign(null);
    } else {
      await db.updateCampaign(campaign);
    }

    setCampaigns((old) => {
      const c = old.filter((t) => t.id !== campaign.id).concat(campaign);
      onCommunityDataUpdated({ campaigns: c });
      return c;
    });
  }, [db, newCampaign, onCommunityDataUpdated]);

  const handleDeleteCampaign = useCallback(async (id: string) => {
    await db.deleteCampaign(id);

    setCampaigns((old) => {
      const c = old.filter((t) => t.id !== id);
      onCommunityDataUpdated({ campaigns: c });
      return c;
    });
  }, [db, onCommunityDataUpdated]);

  useEffect(() => {
    // onCommunityDataUpdated({ campaigns });
  }, [campaigns, onCommunityDataUpdated]);

  return (
    <>
      <ItemList
        items={filtered}
        Item={CampaignCard}
        filterNames={filterNames}
        filterEnabled={filterEnabled}
        onFilterEnabled={setFilterEnabled}
        sortCriteria={sortCriteria}
        searchFields={searchFields}
        onNew={handleNew}
        className={className}
      />
      <CampaignDialog
        campaign={openCampaign}
        editing={openCampaign === newCampaign}
        title={openCampaign === newCampaign ? 'New campaign' : undefined}
        closeOnCancel={openCampaign === newCampaign}
        onClose={useCallback(() => {
          setOpenCampaignId(null);
          setNewCampaign(null);
        }, [setOpenCampaignId])}
        onSave={handleSaveCampaign}
        onDelete={handleDeleteCampaign}
      />
    </>
  );
}
