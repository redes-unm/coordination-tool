'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import FreehandMode from '@/lib/FreehandMode';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import RectangleMode from '@/lib/RectangleMode';
import styles from './Map.module.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiamNveDk5IiwiYSI6ImNscTE1c2xlcjA1cXoybHBnMDk1cmgyODAifQ.2UrggqzuuxrtqoaCilNlbQ';

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-84.396);
  const [lat, setLat] = useState(33.777);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (map.current) {
      return;
    }

    if (!mapContainer.current) {
      throw Error('no map container');
    }

    const mapboxMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom,
    });

    map.current = mapboxMap;

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true,
        combine_features: true,
        uncombine_features: true,
      },
      modes: {
        ...MapboxDraw.modes,
        draw_polygon: FreehandMode,
        draw_rectangle: RectangleMode,
      },
    });

    mapboxMap.addControl(draw);

    // add draw rectangle button (hacky!)
    const firstBtn = document.querySelector('.mapbox-gl-draw_ctrl-draw-btn');
    if (firstBtn) {
      const newBtn = document.createElement(firstBtn.tagName);
      newBtn.classList.add('mapbox-gl-draw_ctrl-draw-btn');
      newBtn.title = 'Draw rectangle';
      newBtn.textContent = 'R';
      newBtn.style.color = 'black';
      newBtn.onclick = () => draw.changeMode('draw_rectangle');
      firstBtn.parentElement?.prepend(newBtn);
    }

    mapboxMap.on('move', () => {
      setLng(mapboxMap.getCenter().lng);
      setLat(mapboxMap.getCenter().lat);
      setZoom(mapboxMap.getZoom());
    });
  }, [lat, lng, zoom]);

  return (
    <div className={styles.container}>
      <div ref={mapContainer} className={styles['mapbox-container']} />
      <div className={styles.sidebar}>
        Lng:
        {' '}
        {lng.toFixed(4)}
        , Lat:
        {' '}
        {lat.toFixed(4)}
        , Zoom:
        {' '}
        {zoom.toFixed(2)}
      </div>
    </div>
  );
}
