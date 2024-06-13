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
    const d = new MapboxDraw({ displayControlsDefault: false, modes });
    draw.current = d;
    map?.addControl(d);

    return () => { draw.current = null; };
  }, [map]);

  // keep mode state in sync with draw mode
  useEffect(() => {
    function handleDrawModeChange(e: MapboxDraw.DrawModeChangeEvent) {
      assertMode(e.mode);
      setMode(e.mode);
    }

    map?.on('draw.modechange', handleDrawModeChange);
    return () => { map?.off('draw.modechange', handleDrawModeChange); };
  }, [map]);

  // watch for selection changes
  useEffect(() => {
    function handleDrawSelectionChange(e: MapboxDraw.DrawSelectionChangeEvent) {
      onSelect(e.features[0]);
    }

    map?.on('draw.selectionchange', handleDrawSelectionChange);
    return () => { map?.off('draw.selectionchange', handleDrawSelectionChange); };
  }, [map, onSelect]);

  // watch for new features
  useEffect(() => {
    function handleDrawCreate(e: MapboxDraw.DrawCreateEvent) {
      const feature = e.features[0] ?? throwErr('create fired with no features');
      onCreate(feature);
      draw.current?.setFeatureProperty(`${feature.id}`, 'drawModeSync', true);
    }

    map?.on('draw.create', handleDrawCreate);
    return () => { map?.off('draw.create', handleDrawCreate); };
  }, [map, onCreate]);

  // keep features on map in sync with provided features
  useEffect(() => {
    const d = draw.current;
    if (!map || !d) return;

    const featuresToKeep = d.getAll().features
      .filter((f) => !f.properties?.['drawModeSync']);

    d.set({
      type: 'FeatureCollection',
      features: features
        .map<Feature>((f) => ({ ...f, properties: { ...f.properties, drawModeSync: true } }))
        .concat(...featuresToKeep),
    });
  }, [map, features]);

  return [
    mode,
    useCallback((m: Mode) => {
      draw.current?.changeMode(m as string);
      setMode(m);
    }, []),
  ];
}
