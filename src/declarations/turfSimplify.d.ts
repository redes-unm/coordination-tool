declare module '@turf/simplify' {
  export default function simplify(geojson: GeoJSON, options: {
    tolerance?: number,
    highQuality?: boolean,
    mutate?: boolean,
  }): GeoJSON;
}
