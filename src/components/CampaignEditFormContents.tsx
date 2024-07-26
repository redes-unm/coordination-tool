import React from 'react';
import { Campaign, assertCampaignType, campaignTypeDisplayNames } from '@/types';
import styles from './CampaignEditFormContents.module.css';
import SelectMenu from './SelectMenu';
import TextInput from './TextInput';

type Props = {
  item: Campaign
  onChange: (item: Campaign) => void
};

function CampaignEditFormContents({
  item: campaign,
  onChange,
}: Props, ref: React.ForwardedRef<{ focus: () => void }>) {
  return (
    <div className={styles['inputs']}>
      <span className={styles['required-disclaimer']}>
        * indicates required field
      </span>

      <TextInput
        ref={ref}
        label="Name *"
        value={campaign.name}
        onChange={(e) => onChange({ ...campaign, name: e.target.value })}
        labelAbove
        required
      />

      <SelectMenu
        options={Object.entries(campaignTypeDisplayNames)}
        value={campaign.type}
        onValueChange={(t) => {
          assertCampaignType(t);
          onChange({ ...campaign, type: t });
        }}
        label="Type"
        labelAbove
      />

      <TextInput
        label="Description"
        value={campaign.description}
        onChange={(e) => onChange({ ...campaign, description: e.target.value })}
        multiLine
        labelAbove
      />
    </div>
  );
}

export default React.forwardRef(CampaignEditFormContents);
