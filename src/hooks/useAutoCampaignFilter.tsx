import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FilterEnabled } from './useFilter';

export default function useAutoCampaignFilter(
  setFilterEnabled: (e: FilterEnabled | ((old: FilterEnabled) => FilterEnabled)) => void,
  campaigns: { id: string, name: string }[],
): {
    message: string
    handleFilterEnabled: (e: FilterEnabled) => void
  } {
  const selectedCampaignId = useSearchParams().get('campaign');
  const [message, setMessage] = useState('');

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

  return { message, handleFilterEnabled };
}
