import EditableItemDisplay from '@/components/EditableItemDisplay';
import AnnotationDisplay from '@/components/map/AnnotationDisplay';
import AnnotationEditFormContents from '@/components/map/AnnotationEditFormContents';
import { throwErr, toLngLat } from '@/lib/util';
import { Annotation } from '@/types';
import center from '@turf/center';
import mapboxgl, { Popup, PopupOptions } from 'mapbox-gl';
import {
  useCallback, useEffect, useRef,
} from 'react';
import { Root, createRoot } from 'react-dom/client';

type EventHandlers = {
  save: ((a: Annotation) => Promise<void>),
  delete: ((id: string) => Promise<void>),
  close?: (() => void) | undefined,
};

export default function usePopup(
  map: mapboxgl.Map | null | undefined,
  annotation: Annotation | undefined,
  handlers: EventHandlers,
  editing?: boolean,
  options?: PopupOptions,
) {
  const root = useRef<Root | null>(null);
  const popup = useRef<Popup | null>(null);

  // create a new popup when the annotation changes
  useEffect(() => {
    if (!annotation?.id || !map) {
      return undefined;
    }

    const p = new Popup(options).addTo(map);
    popup.current = p;

    return () => {
      p.remove();
      popup.current = null;
      root.current = null;
    };
  }, [annotation?.id, map, options]);

  // the linter isn't smart enough to figure out the hook dependencies
  const closeHandler = handlers.close;
  const deleteHandler = handlers.delete;

  // register a close listener
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

  const handleDelete = useCallback(async () => {
    if (annotation?.id !== undefined) {
      await deleteHandler(annotation.id);
    }
    closeHandler?.();
  }, [annotation?.id, deleteHandler, closeHandler]);

  // position and render the popup
  useEffect(() => {
    if (!annotation || !popup.current) {
      return;
    }

    popup.current.setLngLat(toLngLat(center(annotation.geometry).geometry.coordinates));

    if (!root.current) {
      const id = `${annotation.id}-popup-container`;
      popup.current.setHTML(`<div id="${id}"/>`);
      const rootEl = document.getElementById(id) ?? throwErr('no popup container');
      root.current = createRoot(rootEl);

      // The popup repositions itself to stay in view whenever the map moves. It
      // may choose a position that works when the annotation is being displayed
      // but no longer works when it's being edited because it's gotten bigger.
      // Trigger the repositioning whenever the popup's size changes with a
      // little hack: pan the map by 0.
      const observer = new ResizeObserver((entries) => {
        if (entries.find((e) => e.target.id === id)) {
          map?.panBy([0, 0]);
        }
      });

      observer.observe(rootEl);
    }

    root.current.render(
      <EditableItemDisplay
        item={annotation}
        editing={editing}
        onSave={handlers.save}
        onDelete={handleDelete}
        Display={AnnotationDisplay}
        EditFormContents={AnnotationEditFormContents}
      />,
    );
  }, [annotation, editing, handlers.save, handleDelete, map]);
}
