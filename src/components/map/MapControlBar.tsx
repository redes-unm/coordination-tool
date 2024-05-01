import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import btnStyles from '@/components/Button.module.css';
import { RefObject, useCallback, useMemo } from 'react';
import { toBlob } from 'html-to-image';
import { saveAs } from 'file-saver';
import { throwErr } from '@/lib/util';
import {
  Annotation, AnnotationWithCampaigns, annotationTypeDisplayNames, assertAnnotationType,
} from '@/types';
import styles from './MapControlBar.module.css';
import FilterMenu, { FilterGroupDef } from '../FilterMenu';

type Props = {
  mapRef: RefObject<HTMLElement>
  annotations: AnnotationWithCampaigns[]
  campaigns: { id: string, name: string }[]
  onAnnotationsFiltered: (filtered: Annotation[]) => void
};

export default function MapControlBar({
  mapRef,
  annotations,
  campaigns,
  onAnnotationsFiltered,
}: Props) {
  const annotationFilters: FilterGroupDef<AnnotationWithCampaigns>[] = useMemo(() => [
    {
      defs: Object.entries(annotationTypeDisplayNames).map(([type, name]) => {
        assertAnnotationType(type);
        return { name, field: 'type', value: type };
      }),
      header: 'By type',
    },
    {
      defs: campaigns.map((c) => ({
        name: c.name,
        match: (a: AnnotationWithCampaigns) => a.campaignIds.includes(c.id),
      })),
      header: 'By campaign',
    },
  ], [campaigns]);

  const handleSaveViewClicked = useCallback(async () => {
    const blob = await toBlob(mapRef.current ?? throwErr('no map ref'), {
      filter: (node) => !node.classList.contains('mapboxgl-ctrl'),
    }) ?? throwErr('no blob created');

    saveAs(blob, 'map-view.png');
  }, [mapRef]);

  return (
    <div className={styles['bar']}>
      <FilterMenu
        items={annotations}
        filters={annotationFilters}
        onFiltered={onAnnotationsFiltered}
        label="Filter annotations"
      />

      <button
        type="button"
        className={btnStyles['btn']}
        onClick={handleSaveViewClicked}
      >
        <FontAwesomeIcon icon={faDownload} className={btnStyles['icon'] ?? ''} />
        <span>Save map view</span>
      </button>
    </div>
  );
}
