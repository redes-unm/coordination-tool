import { IControl } from 'mapbox-gl';
import {
  FC,
  useEffect, useRef, useState,
} from 'react';
import { Root, createRoot } from 'react-dom/client';

export default function useControl<P extends {}>(
  map: mapboxgl.Map | null | undefined,
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
  Component: FC<P>,
  props: P,
) {
  const [container, setContainer] = useState<HTMLDivElement>();
  const root = useRef<Root | null>(null);

  useEffect(() => {
    const control: IControl & { container?: HTMLDivElement } = {
      onAdd() {
        this.container = document.createElement('div');
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        setContainer(this.container);
        return this.container;
      },

      onRemove() {
        root.current?.unmount();
        root.current = null;
        this.container?.parentNode?.removeChild(this.container);
        setContainer(undefined);
      },
    };

    map?.addControl(control, position);
    return () => {
      try {
        map?.removeControl(control);
      } catch (e) {
        // Map may have already been removed
      }
    };
  }, [map, position]);

  useEffect(() => {
    if (!container) {
      root.current = null;
      return;
    }

    if (!root.current) {
      root.current = createRoot(container);
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    root.current.render(<Component {...props} />);
  }, [container, Component, props]);
}
