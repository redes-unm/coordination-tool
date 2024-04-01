import PopupContents from '@/components/map/PopupContents';
import { throwErr, toLngLat } from '@/lib/util';
import { Annotation } from '@/types';
import center from '@turf/center';
import mapboxgl, { Popup, PopupOptions } from 'mapbox-gl';
import { RefObject, useEffect, useRef } from 'react';
import { Root, createRoot } from 'react-dom/client';

type EventHandlers = {
  save?: ((a: Annotation) => void) | undefined,
  delete?: (() => void) | undefined,
  close?: (() => void) | undefined,
};

export default function usePopup(
  map: RefObject<mapboxgl.Map>,
  annotation: Annotation | undefined,
  handlers: EventHandlers,
  options?: PopupOptions,
) {
  const root = useRef<Root | null>(null);
  const popup = useRef<Popup | null>(null);

  // create a new popup when the annotation changes
  useEffect(() => {
    if (!annotation?.id || !map.current) {
      return undefined;
    }

    const p = new Popup(options).addTo(map.current);
    popup.current = p;

    return () => {
      p.remove();
      popup.current = null;
      root.current = null;
    };
  }, [annotation?.id, map, options]);

  // register a close listener
  const closeHandler = handlers.close; // because the linter isn't smart enough
  useEffect(() => {
    if (!popup.current) {
      return undefined;
    }

    function handleClose() {
      closeHandler?.();
      popup.current = null;
      root.current = null;
    }

    const p = popup.current;
    p.on('close', handleClose);
    return () => { p.off('close', handleClose); };
  }, [annotation?.id, closeHandler]);

  // position and render the popup
  useEffect(() => {
    if (!annotation || !popup.current) {
      return;
    }

    popup.current.setLngLat(toLngLat(center(annotation.geometry).geometry.coordinates));

    if (!root.current) {
      const id = `${annotation.id}-popup-container`;
      popup.current.setHTML(`<div id="${id}"/>`);
      root.current = createRoot(document.getElementById(id) ?? throwErr('no popup container'));
    }

    root.current.render(
      <PopupContents
        annotation={annotation}
        onSave={handlers.save}
        onDelete={handlers.delete}
      />,
    );
  }, [annotation, handlers.save, handlers.delete]);
}
