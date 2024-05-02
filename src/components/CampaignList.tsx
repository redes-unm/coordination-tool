'use client';

import { newDb } from '@/db/client';
import { useAsyncResource } from '@/lib/AsyncResource';
import { CampaignWithCounts, assertCampaignType, campaignTypeDisplayNames } from '@/types';
import { useCallback, useContext, useMemo } from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import { FilterGroupDef } from './FilterMenu';
import { SortDef } from './SortMenu';
import { SearchField } from './SearchBox';
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

  const filterDefs: FilterGroupDef<CampaignWithCounts>[] = useMemo(() => [
    {
      defs: Object.entries(campaignTypeDisplayNames).map(([type, name]) => {
        assertCampaignType(type);
        return { name, field: 'type', value: type };
      }),
      header: 'By type',
    },
  ], []);

  const sortDefs: SortDef<CampaignWithCounts>[] = useMemo(() => [
    {
      key: 'Name',
      field: 'name',
    },
    {
      key: 'Type',
      field: 'type',
      categoryDefs: Object.entries(campaignTypeDisplayNames)
        .map(([type, name]) => {
          assertCampaignType(type);
          return { name, field: 'type', value: type };
        }),
    },
  ], []);

  const searchFields: SearchField<CampaignWithCounts>[] = useMemo(() => ['name', 'description'], []);

  return (
    <ItemList
      items={campaigns}
      Item={CampaignCard}
      filterDefs={filterDefs}
      sortDefs={sortDefs}
      searchFields={searchFields}
      className={className}
    />
  );
}
