import modes, { Mode, assertMode } from '@/lib/mapboxDrawModes';
import { throwErr } from '@/lib/util';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Feature } from 'geojson';
import mapboxgl from 'mapbox-gl';
import {
  Dispatch,
  RefObject, SetStateAction, useEffect, useRef, useState,
} from 'react';

export default function useDraw(
  map: RefObject<mapboxgl.Map>,
  features: Feature[],
  onSelect: (f?: Feature) => void,
  onCreate: (f: Feature) => void,
): [Mode, Dispatch<SetStateAction<Mode>>] {
  const draw = useRef<MapboxDraw | null>(null);
  const [mode, setMode] = useState<Mode>('simple_select');

  // setup draw on map
  useEffect(() => {
    const m = map.current;
    if (!m) {
      return undefined;
    }

    const d = new MapboxDraw({ displayControlsDefault: false, modes });
    draw.current = d;
    m.addControl(d);

    return () => { draw.current = null; };
  }, [map]);

  // keep mode in sync with state
  useEffect(() => { draw.current?.changeMode(mode as string); }, [mode]);
  useEffect(() => {
    function handleDrawModeChange(e: MapboxDraw.DrawModeChangeEvent) {
      assertMode(e.mode);
      setMode(e.mode);
    }

    const m = map.current;
    m?.on('draw.modechange', handleDrawModeChange);
    return () => { m?.off('draw.modechange', handleDrawModeChange); };
  }, [map]);

  // watch for selection changes
  useEffect(() => {
    function handleDrawSelectionChange(e: MapboxDraw.DrawSelectionChangeEvent) {
      onSelect(e.features[0]);
    }

    const m = map.current;
    m?.on('draw.selectionchange', handleDrawSelectionChange);
    return () => { m?.off('draw.selectionchange', handleDrawSelectionChange); };
  }, [map, onSelect]);

  // watch for new features
  useEffect(() => {
    function handleDrawCreate(e: MapboxDraw.DrawCreateEvent) {
      onCreate(e.features[0] ?? throwErr('create fired with no features'));
    }

    const m = map.current;
    m?.on('draw.create', handleDrawCreate);
    return () => { m?.off('draw.create', handleDrawCreate); };
  }, [map, onCreate]);

  // keep features on map in sync with provided features
  useEffect(() => {
    draw.current?.set({
      type: 'FeatureCollection',
      features,
    });
  }, [features]);

  return [mode, setMode];
}
