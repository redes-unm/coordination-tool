'use client';

import { newDb } from '@/db/client';
import { useAsyncResource } from '@/lib/AsyncResource';
import { CampaignWithCounts, assertCampaignType, campaignTypeDisplayNames } from '@/types';
import { useCallback, useContext, useMemo } from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import { Filter } from '@/hooks/useFilter';
import { SearchField } from '@/hooks/useSearch';
import { SortDef } from './SortMenu';
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
      filter={filter}
      sortDefs={sortDefs}
      searchFields={searchFields}
      className={className}
    />
  );
}
