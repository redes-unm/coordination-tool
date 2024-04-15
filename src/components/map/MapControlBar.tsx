import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import btnStyles from '@/components/Button.module.css';
import { RefObject, useCallback } from 'react';
import { toBlob } from 'html-to-image';
import { saveAs } from 'file-saver';
import { throwErr } from '@/lib/util';
import styles from './MapControlBar.module.css';

type Props = {
  mapRef: RefObject<HTMLElement>
};

export default function MapControlBar({
  mapRef,
}: Props) {
  const handleSaveViewClicked = useCallback(async () => {
    const blob = await toBlob(mapRef.current ?? throwErr('no map ref'), {
      filter: (node) => !node.classList.contains('mapboxgl-ctrl'),
    }) ?? throwErr('no blob created');

    saveAs(blob, 'map-view.png');
  }, [mapRef]);

  return (
    <div className={styles['bar']}>
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
