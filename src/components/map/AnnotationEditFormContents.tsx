import {
  Annotation, annotationTypeDisplayNames, assertAnnotationType,
} from '@/types';
import React, {
  ChangeEvent, useCallback, useContext, useMemo,
} from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import TextInput from '../TextInput';
import styles from './AnnotationEditFormContents.module.css';
import SelectMenu from '../SelectMenu';
import MultiSelectMenu from '../MultiSelectMenu';

type Props = {
  item: Annotation
  onChange: (a: Annotation) => void
};

function AnnotationEditFormContents({
  item: annotation,
  onChange,
}: Props, ref: React.ForwardedRef<{ focus: () => void }>) {
  const { campaigns } = useContext(CommunityContext);

  const campaignItems = useMemo(() => (
    campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      selected: annotation.campaignIds.includes(c.id),
    }))
  ), [campaigns, annotation.campaignIds]);

  const handleCampaignSelectedChange = useCallback((id: string, selected: boolean) => {
    onChange({
      ...annotation,
      campaignIds: selected
        ? annotation.campaignIds.concat(id)
        : annotation.campaignIds.filter((cid) => cid !== id),
    });
  }, [onChange, annotation]);

  return (
    <div className={styles['inputs']}>
      <TextInput
        ref={ref}
        label="Name"
        value={annotation.name}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => {
          onChange({ ...annotation, name: e.target.value });
        }, [annotation, onChange])}
        required
        labelAbove
      />

      <SelectMenu
        options={Object.entries(annotationTypeDisplayNames)}
        value={annotation.type}
        onValueChange={useCallback((t) => {
          assertAnnotationType(t);
          onChange({ ...annotation, type: t });
        }, [annotation, onChange])}
        label="Type"
        labelAbove
      />

      <MultiSelectMenu
        label="Campaigns"
        items={campaignItems}
        onSelectedChange={handleCampaignSelectedChange}
      />

      <TextInput
        label="Description"
        value={annotation.description}
        onChange={useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
          onChange({ ...annotation, description: e.target.value });
        }, [annotation, onChange])}
        multiLine
        labelAbove
      />
    </div>
  );
}

export default React.forwardRef(AnnotationEditFormContents);
