import drawStyles from '@/lib/drawStyles';
import modes, { Mode, assertMode } from '@/lib/mapboxDrawModes';
import { throwErr } from '@/lib/util';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Feature } from 'geojson';
import mapboxgl from 'mapbox-gl';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';

export default function useDraw(
  map: mapboxgl.Map | null | undefined,
  features: Feature[],
  onSelect: (f?: Feature) => void,
  onCreate: (f: Feature) => void,
): [Mode, (m: Mode) => void] {
  const draw = useRef<MapboxDraw | null>(null);
  const [mode, setMode] = useState<Mode>('simple_select');

  // setup draw on map
  useEffect(() => {
    if (!map) return () => {};

    const d = new MapboxDraw({
      displayControlsDefault: false,
      modes,
      styles: drawStyles,
      userProperties: true,
    });
    draw.current = d;
    map.addControl(d);

    return () => {
      try {
        map.removeControl(d);
      } catch (e) {
        // Map may have already been removed
      }
    };
  }, [map, drawStyles]);

  // keep mode state in sync with draw mode
  useEffect(() => {
    function handleDrawModeChange(e: MapboxDraw.DrawModeChangeEvent) {
      assertMode(e.mode);
      setMode(e.mode);
    }

    map?.on('draw.modechange', handleDrawModeChange);
    return () => {
      try {
        map?.off('draw.modechange', handleDrawModeChange);
      } catch (e) {
        // Map may have already been removed
      }
    };
  }, [map]);

  // watch for selection changes
  useEffect(() => {
    function handleDrawSelectionChange(e: MapboxDraw.DrawSelectionChangeEvent) {
      onSelect(e.features[0]);
    }

    map?.on('draw.selectionchange', handleDrawSelectionChange);
    return () => {
      try {
        map?.off('draw.selectionchange', handleDrawSelectionChange);
      } catch (e) {
        // Map may have already been removed
      }
    };
  }, [map, onSelect]);

  // watch for new features
  useEffect(() => {
    function handleDrawCreate(e: MapboxDraw.DrawCreateEvent) {
      onCreate(e.features[0] ?? throwErr('create fired with no features'));
    }

    map?.on('draw.create', handleDrawCreate);
    return () => {
      try {
        map?.off('draw.create', handleDrawCreate);
      } catch (e) {
        // Map may have already been removed
      }
    };
  }, [map, onCreate]);

  // Keep features on map in sync with the `features` prop.
  useEffect(() => {
    const d = draw.current;
    if (!map || !d) return;

    // Use `add` to update any existing features and add new ones.
    d.add({ type: 'FeatureCollection', features });
    const newFeatureIds = new Set(features.map((f) => f.id));
    const toDelete = d.getAll().features.filter((f) => f.id && !newFeatureIds.has(f.id));
    if (toDelete.length > 0) d.delete(toDelete.map((f) => `${f.id}`));
  }, [map, features]);

  return [
    mode,
    useCallback((m: Mode) => {
      draw.current?.changeMode(m as string);
      setMode(m);
    }, []),
  ];
}
