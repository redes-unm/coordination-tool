'use client';

import { newDb } from '@/db/client';
import { useAsyncResource } from '@/lib/AsyncResource';
import { CampaignWithCounts, assertCampaignType, campaignTypeDisplayNames } from '@/types';
import { useCallback, useContext, useMemo } from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import useFilter, { Filter } from '@/hooks/useFilter';
import { SearchField } from '@/hooks/useSearch';
import { SortCriteria } from '@/hooks/useSort';
import ItemList from './ItemList';
import CampaignCard from './CampaignCard';

type Props = {
  className?: string | undefined
};

export default function CampaignList({ className }: Props) {
  const community = useContext(CommunityContext);
  const campaigns = useAsyncResource(
    useCallback(() => newDb().getCampaigns(community.id), [community.id]),
  ) ?? [];

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

  return (
    <ItemList
      items={filtered}
      Item={CampaignCard}
      filterNames={filterNames}
      filterEnabled={filterEnabled}
      onFilterEnabled={setFilterEnabled}
      sortCriteria={sortCriteria}
      searchFields={searchFields}
      className={className}
    />
  );
}
