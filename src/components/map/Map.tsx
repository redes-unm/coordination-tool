'use client';

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
import styles from './Map.module.css';
import AddAnnotationControl from './AddAnnotationControl';

mapboxgl.accessToken = 'pk.eyJ1IjoiamNveDk5IiwiYSI6ImNscTE1c2xlcjA1cXoybHBnMDk1cmgyODAifQ.2UrggqzuuxrtqoaCilNlbQ';

type AnnotationFeature = Feature<Geometry, Omit<Annotation, 'geometry' | 'id'>>;

type Props = {
  annotations: Annotation[],
  onAdd?: (a: Annotation) => void
  onDelete?: (a: Annotation) => void
  initialLngLat?: [number, number]
  initialZoom?: number
};

const defaultLngLat: [number, number] = [-84.396, 33.777];
const defaultZoom = 12;

export default function Map({
  annotations,
  initialLngLat = defaultLngLat,
  initialZoom = defaultZoom,
  onAdd = undefined,
  onDelete = undefined,
}: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [newAnnotation, setNewAnnotation] = useState<Annotation | undefined>();

  const selectedAnnotation = useMemo(
    () => annotations.find((a) => a.id === selectedId),
    [annotations, selectedId],
  );

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
      const as = [...annotations];
      if (newAnnotation) {
        as.push(newAnnotation);
      }

      return as.map<AnnotationFeature>((a) => ({
        type: 'Feature',
        geometry: a.geometry,
        id: a.id,
        properties: {
          name: a.name,
          type: a.type,
        },
      }));
    }, [annotations, newAnnotation]),
    useCallback((f) => {
      setSelectedId(f && `${f.id ?? throwErr('feature selected without id')}`);
    }, []),
    useCallback((f) => {
      setNewAnnotation({
        id: `${f.id ?? throwErr('feature created without id')}`,
        name: '',
        type: 'infra',
        geometry: f.geometry,
      });
    }, []),
  );

  // show a popup for the selected annotation
  usePopup(map, selectedAnnotation, {
    delete: useMemo(
      () => onDelete && selectedAnnotation && (() => onDelete(selectedAnnotation)),
      [onDelete, selectedAnnotation],
    ),
  });

  // show a popup for a new annotation
  usePopup(map, newAnnotation, {
    save: useCallback((a: Annotation) => {
      onAdd?.(a);
      setNewAnnotation(undefined);
    }, [onAdd]),
    close: useCallback(() => setNewAnnotation(undefined), []),
  }, useMemo(() => ({ closeOnClick: false }), []));

  return (
    <div className={styles['container']}>
      <div ref={mapContainer} className={styles['mapbox-container']} />
      { onAdd && !newAnnotation && (
        <AddAnnotationControl
          className={styles['add-control']}
          mode={drawMode}
          onModeChange={setDrawMode}
        />
      )}
    </div>
  );
}
