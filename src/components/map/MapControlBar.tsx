import * as Dropdown from '@radix-ui/react-dropdown-menu';
import {
  faCheck,
  faChevronDown, faChevronUp, faDownload, faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import btnStyles from '@/components/Button.module.css';
import menuStyles from '@/components/Menu.module.css';
import { RefObject, useCallback } from 'react';
import { toBlob } from 'html-to-image';
import { saveAs } from 'file-saver';
import { throwErr } from '@/lib/util';
import { AnnotationType, annotationTypeDisplayNames, assertAnnotationType } from '@/types';
import { AnnotationFilters } from '@/hooks/useAnnotationFilters';
import styles from './MapControlBar.module.css';

type Props = {
  mapRef: RefObject<HTMLElement>
  annotationFilters: AnnotationFilters
  onAnnotationFiltersChange: (filters: AnnotationFilters) => void
};

export default function MapControlBar({
  mapRef,
  annotationFilters,
  onAnnotationFiltersChange,
}: Props) {
  const handleAnnotationFilterCheckedChange = useCallback(
    (type: AnnotationType, checked: boolean) => onAnnotationFiltersChange({
      ...annotationFilters,
      [type]: checked,
    }),
    [annotationFilters, onAnnotationFiltersChange],
  );

  const handleToggleAllAnnotations = useCallback((show: boolean) => onAnnotationFiltersChange({
    infra: show,
    equipment: show,
    person: show,
    poi: show,
    region: show,
  }), [onAnnotationFiltersChange]);

  const handleSaveViewClicked = useCallback(async () => {
    const blob = await toBlob(mapRef.current ?? throwErr('no map ref'), {
      filter: (node) => !node.classList.contains('mapboxgl-ctrl'),
    }) ?? throwErr('no blob created');

    saveAs(blob, 'map-view.png');
  }, [mapRef]);

  return (
    <div className={styles['bar']}>
      <Dropdown.Root>
        <Dropdown.Trigger className={`${btnStyles['btn']} ${menuStyles['menu-btn']}`}>
          <span>
            <FontAwesomeIcon icon={faFilter} className={btnStyles['icon'] ?? ''} />
            Filter annotations
          </span>
          <span className={menuStyles['menu-icon']}>
            <FontAwesomeIcon icon={faChevronDown} className={menuStyles['menu-icon-closed'] || ''} />
            <FontAwesomeIcon icon={faChevronUp} className={menuStyles['menu-icon-open'] || ''} />
          </span>
        </Dropdown.Trigger>

        <Dropdown.Portal>
          <Dropdown.Content className={menuStyles['menu-content']}>
            <Dropdown.Arrow className={menuStyles['menu-arrow']} />
            {Object.entries(annotationTypeDisplayNames).map(([type, name]) => {
              assertAnnotationType(type);

              return (
                <Dropdown.CheckboxItem
                  key={type}
                  className={menuStyles['menu-item']}
                  checked={annotationFilters[type]}
                  onCheckedChange={(c) => handleAnnotationFilterCheckedChange(type, c)}
                >
                  <Dropdown.ItemIndicator className={menuStyles['item-check']}>
                    <FontAwesomeIcon icon={faCheck} />
                  </Dropdown.ItemIndicator>
                  {name}
                </Dropdown.CheckboxItem>
              );
            })}

            <Dropdown.Separator className={menuStyles['separator']}>
              <hr />
            </Dropdown.Separator>

            <Dropdown.Item
              className={menuStyles['menu-item']}
              onClick={() => handleToggleAllAnnotations(true)}
              disabled={Object.values(annotationFilters).every((f) => f)}
            >
              Show all
            </Dropdown.Item>

            <Dropdown.Item
              className={menuStyles['menu-item']}
              onClick={() => handleToggleAllAnnotations(false)}
              disabled={Object.values(annotationFilters).every((f) => !f)}
            >
              Hide all
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Portal>
      </Dropdown.Root>

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
