import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Filter, FilterEnabled } from './useFilter';

export default function useAutoCampaignFilter<T>(
  setFilterEnabled: (e: FilterEnabled | ((old: FilterEnabled) => FilterEnabled)) => void,
  campaignFilter: Filter<T>[string],
): {
    message: string
    handleFilterEnabled: (e: FilterEnabled) => void
  } {
  const selectedCampaignId = useSearchParams().get('campaignFilter');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const selectedCampaign = campaignFilter.items[selectedCampaignId ?? ''];
    if (selectedCampaign) {
      setMessage(`Filtered to campaign ${selectedCampaign.name}.`);
      setFilterEnabled((old) => ({
        ...old,
        campaign: Object.keys(campaignFilter.items).reduce((enabled, campaign) => ({
          ...enabled,
          [campaign]: campaign === selectedCampaignId,
        }), {}),
      }));
    } else {
      setMessage('');
    }
  }, [selectedCampaignId, setFilterEnabled, campaignFilter]);

  const handleFilterEnabled = useCallback((e: FilterEnabled) => {
    setMessage('');
    setFilterEnabled(e);
  }, [setFilterEnabled]);

  return { message, handleFilterEnabled };
}
