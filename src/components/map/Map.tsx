import './map.css';
import React, {
  useRef, useEffect, useState, useMemo, useCallback,
} from 'react';
import { Feature, Geometry } from 'geojson';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { throwErr } from '@/lib/util';
import usePopup from '@/hooks/usePopup';
import useDraw from '@/hooks/useDraw';
import { Annotation } from '@/types';
import strftime from 'strftime';
import useMapControl from '@/hooks/useMapControl';
import saveAs from 'file-saver';
import { toBlob } from 'html-to-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import btnStyles from '@/components/Button.module.css';
import { FilterEnabled, FilterNames } from '@/hooks/useFilter';
import styles from './Map.module.css';
import ModeControl from './ModeControl';
import FilterMenu from '../FilterMenu';

mapboxgl.accessToken = 'pk.eyJ1IjoiamNveDk5IiwiYSI6ImNscTE1c2xlcjA1cXoybHBnMDk1cmgyODAifQ.2UrggqzuuxrtqoaCilNlbQ';

type AnnotationFeature = Feature<Geometry, Omit<Annotation, 'geometry' | 'id'>>;

function annotationToFeature(a: Annotation): AnnotationFeature {
  return {
    type: 'Feature',
    geometry: a.geometry,
    id: a.id,
    properties: {
      name: a.name,
      description: a.description,
      type: a.type,
      campaignIds: a.campaignIds,
    },
  };
}

type Props = {
  annotations: Annotation[]
  filterNames: FilterNames
  filterEnabled: FilterEnabled
  onFilterEnabled: (e: FilterEnabled) => void
  message?: string | undefined
  onAdd: (a: Annotation) => Promise<void>
  onUpdate: (a: Annotation) => Promise<void>
  onDelete: (id: string) => Promise<void>
  initialLngLat?: [number, number]
  initialZoom?: number
};

const defaultLngLat: [number, number] = [-84.396, 33.777];
const defaultZoom = 12;

export default function Map({
  annotations,
  filterNames,
  filterEnabled,
  onFilterEnabled,
  message,
  initialLngLat = defaultLngLat,
  initialZoom = defaultZoom,
  onAdd,
  onDelete,
  onUpdate,
}: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | undefined>();
  const [newAnnotation, setNewAnnotation] = useState<Annotation | undefined>();

  const handleSaveViewClicked = useCallback(async () => {
    const blob = await toBlob(mapContainer.current ?? throwErr('no map ref'), {
      filter: (node) => !node.classList.contains('mapboxgl-ctrl'),
    }) ?? throwErr('no blob created');

    saveAs(blob, 'map-view.png');
  }, []);

  // update the selected annotation when the annotations change, but don't allow
  // the selected annotation to be cleared as a result
  useEffect(() => {
    setSelectedAnnotation((old) => annotations.find((a) => a.id === old?.id) ?? old);
  }, [annotations]);

  // clear the new annotation when the selected annotation is cleared
  useEffect(() => {
    if (!selectedAnnotation) {
      setNewAnnotation(undefined);
    }
  }, [selectedAnnotation]);

  // create map
  useEffect(() => {
    if (map.current) {
      return () => {};
    }

    const mapboxMap = new mapboxgl.Map({
      container: mapContainer.current ?? throwErr('no map container'),
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialLngLat,
      zoom: initialZoom,
      preserveDrawingBuffer: true,
    });

    map.current = mapboxMap;

    return () => {
      mapboxMap.remove();
      map.current = null;
    };
  }, [initialLngLat, initialZoom]);

  // enable drawing on the map
  const [drawMode, setDrawMode] = useDraw(
    map,
    useMemo(() => {
      const features = annotations.map(annotationToFeature);
      if (newAnnotation && !features.find((f) => f.id === newAnnotation.id)) {
        features.push(annotationToFeature(newAnnotation));
      }
      return features;
    }, [annotations, newAnnotation]),
    useCallback((f) => {
      setSelectedAnnotation(f && (
        f.id === newAnnotation?.id
          ? newAnnotation
          : annotations.find((a) => a.id === f.id)
      ));
    }, [annotations, newAnnotation]),
    useCallback(async (f) => {
      const id = `${f.id ?? throwErr('feature created without id')}`;
      const annotation: Annotation = {
        id,
        name: `${f.geometry.type} created ${strftime('%m-%d-%Y@%H:%M:%S')}`,
        description: '',
        type: 'infra',
        geometry: f.geometry,
        campaignIds: [],
      };

      setNewAnnotation(annotation);
      await onAdd(annotation);
    }, [onAdd]),
  );

  // show a popup for the selected annotation
  usePopup(map, selectedAnnotation, {
    save: onUpdate,
    delete: onDelete,
    close: useCallback(() => setSelectedAnnotation(undefined), []),
  }, !!newAnnotation);

  useMapControl(
    map,
    'top-left',
    ModeControl,
    useMemo(() => ({ mode: drawMode, onModeChange: setDrawMode }), [drawMode, setDrawMode]),
  );

  return (
    <div className={styles['container']}>
      <div className={styles['bar']}>
        <FilterMenu
          names={filterNames}
          enabled={filterEnabled}
          onEnabledChange={onFilterEnabled}
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
      <div className={styles['message']}>{message}</div>
      <div ref={mapContainer} className={styles['mapbox-container']} />
    </div>
  );
}
