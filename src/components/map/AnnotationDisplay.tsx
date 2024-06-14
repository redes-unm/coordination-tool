import { Annotation, annotationTypeDisplayNames } from '@/types';
import CommunityContext from '@/contexts/CommunityContext';
import { useContext, useMemo } from 'react';
import { shorten } from '@/lib/util';
import styles from './AnnotationDisplay.module.css';

type Props = {
  item: Annotation
};

export default function AnnotationDisplay({ item: annotation }: Props) {
  const { campaigns } = useContext(CommunityContext);
  const annotationCampaigns = useMemo(() => (
    // create a comma-separated list of the names of the campaigns associated
    // with the annotation, sorted to ensure consistent ordering, and with each
    // name limited to at most 20 characters
    annotation.campaignIds
      .map((id) => campaigns.find((c) => c.id === id)?.name ?? '')
      .filter((n) => !!n)
      .sort()
      .map((n) => shorten(n, 20))
      .join(', ')
  ), [campaigns, annotation.campaignIds]);

  return (
    <div className={styles['container']}>
      <strong className={styles['title']}>{annotation.name}</strong>
      <div>{`Type: ${annotationTypeDisplayNames[annotation.type]}`}</div>
      <div>{`Campaigns: ${annotationCampaigns || '[none]'}`}</div>
      <div className={styles['description']}>
        {
          annotation.description.split('\n')
            .filter((s) => !!s.trim())
            /* eslint-disable-next-line react/no-array-index-key --
               there's nothing else unique to use */
            .map((p, i) => <p key={i}>{p}</p>)
        }
      </div>
    </div>
  );
}
