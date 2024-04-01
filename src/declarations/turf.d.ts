// TODO: remove this file once turf 7.0 is out

declare module '@turf/center' {
  export default function center<P = object>(
    geojson: import('geojson').GeoJSON,
    options?: object
  ): import('geojson').Feature<import('geojson').Point, P>;
}

declare module '@turf/simplify' {
  export default function simplify(geojson: import('geojson').GeoJSON, options: {
    tolerance?: number,
    highQuality?: boolean,
    mutate?: boolean,
  }): import('geojson').GeoJSON;
}
