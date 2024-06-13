'use client';

import { v4 as uuid } from 'uuid';
import { newDb } from '@/db/client';
import {
  Campaign, assertCampaignType, campaignTypeDisplayNames,
} from '@/types';
import {
  useCallback, useContext, useMemo, useState,
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
  className?: string | undefined
};

export default function CampaignList({ className }: Props) {
  const { community, campaigns, onCommunityDataUpdated } = useContext(CommunityContext);
  const db = useMemo(() => newDb(), []);
  const [newCampaign, setNewCampaign] = useState<Campaign | null>(null);
  const [openCampaignId, setOpenCampaignId] = useSearchParam('campaign');

  const openCampaign = useMemo(
    () => newCampaign ?? campaigns.find((c) => c.id === openCampaignId),
    [campaigns, newCampaign, openCampaignId],
  );

  const filter: Filter<Campaign> = useMemo(() => ({
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

  const sortCriteria: SortCriteria<Campaign> = useMemo(() => ({
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

  const searchFields: SearchField<Campaign>[] = useMemo(() => ['name', 'description'], []);

  const handleNew = useCallback(() => setNewCampaign({
    id: uuid(),
    name: '',
    description: '',
    type: 'measurement',
    communityId: community.id,
    default: false,
  }), [community.id]);

  const handleSaveCampaign = useCallback(async (campaign: Campaign) => {
    if (newCampaign) {
      await db.insertCampaign(campaign);
      setNewCampaign(null);
    } else {
      await db.updateCampaign(campaign);
    }

    onCommunityDataUpdated({
      campaigns: campaigns.filter((t) => t.id !== campaign.id).concat(campaign),
    });
  }, [db, newCampaign, onCommunityDataUpdated, campaigns]);

  const handleDeleteCampaign = useCallback(async (id: string) => {
    await db.deleteCampaign(id);

    onCommunityDataUpdated({ campaigns: campaigns.filter((t) => t.id !== id) });
  }, [db, onCommunityDataUpdated, campaigns]);

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
