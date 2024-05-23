import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Geometry } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { throwErr } from '@/lib/util';
import './location-map.css';
import styles from './LocationPickerMap.module.css';

mapboxgl.accessToken = process.env['NEXT_PUBLIC_MAPBOX_TOKEN'] ?? throwErr('no mapbox token!');

type Props = {
  location: [number, number] | undefined
  onLocationChange: (l: [number, number] | undefined) => void
};

const defaultLngLat: [number, number] = [-84.396, 33.777];
const defaultZoom = 12;

export default function LocationPickerMap({
  location,
  onLocationChange,
}: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const initialLocation = useRef(location);

  useEffect(() => {
    if (map.current) {
      return () => {};
    }

    const mapboxMap = new mapboxgl.Map({
      container: mapContainer.current ?? throwErr('no map container'),
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialLocation.current ?? defaultLngLat,
      zoom: defaultZoom,
    });

    map.current = mapboxMap;

    return () => {
      mapboxMap.remove();
      map.current = null;
      marker.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) {
      throw Error('no map!');
    }

    function handleClick(e: mapboxgl.MapMouseEvent) {
      e.preventDefault();
      onLocationChange([e.lngLat.lng, e.lngLat.lat]);
    }

    function handleDoubleClick(e: mapboxgl.MapMouseEvent) {
      e.preventDefault();
      // do nothing
    }

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
      enableEventLogging: false,
    });

    function handleGeocoderResult(e: { result: { geometry: Geometry } }) {
      if (e.result.geometry.type !== 'Point') {
        return;
      }

      const [lng, lat] = e.result.geometry.coordinates;
      if (lng === undefined || lat === undefined) {
        return;
      }

      onLocationChange([lng, lat]);
    }

    const geolocator = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
    });

    function handleGeolocate(p?: unknown) {
      if (!p || typeof p !== 'object'
          || !('coords' in p) || !(p.coords instanceof GeolocationCoordinates)) {
        return;
      }

      onLocationChange([p.coords.longitude, p.coords.latitude]);
    }

    map.current.on('click', handleClick);
    map.current.on('dblclick', handleDoubleClick);
    geocoder.on('result', handleGeocoderResult);
    geolocator.on('geolocate', handleGeolocate);
    map.current.addControl(geocoder, 'top-left');
    map.current.addControl(geolocator, 'top-left');

    return () => {
      map.current?.off('click', handleClick);
      map.current?.off('dblclick', handleDoubleClick);
      map.current?.removeControl(geocoder);
      map.current?.removeControl(geolocator);
    };
  }, [onLocationChange]);

  useEffect(() => {
    if (!map.current) {
      throw Error('no map!');
    }

    if (!location) {
      marker.current?.remove();
      marker.current = null;
      return;
    }

    if (!marker.current) {
      marker.current = new mapboxgl.Marker({
        className: styles['marker'],
        color: '#db1ec8',
      }).setLngLat(location).addTo(map.current);
    } else {
      marker.current.setLngLat(location);
    }
  }, [location]);

  return (
    <div className={`location-picker ${styles['container']}`}>
      <div ref={mapContainer} className={styles['mapbox-container']} />
    </div>
  );
}
