// Tweaked version of default styles from
// https://github.com/mapbox/mapbox-gl-draw/blob/main/src/lib/theme.js.
//
// Original code copyright (c) Mapbox
// ISC License

const magenta = '#fc07cf';
const blue = '#3bb2d0';
const white = '#fff';

const styles = [
  // Polygons
  //   Solid fill
  //   Active state defines color
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: [
      'all',
      ['==', '$type', 'Polygon'],
    ],
    paint: {
      'fill-color': [
        'case',
        ['==', ['get', 'active'], 'true'], blue,
        magenta,
      ],
      'fill-opacity': 0.1,
    },
  },
  // Lines
  // Polygon
  //   Matches Lines AND Polygons
  //   Active state defines color
  {
    id: 'gl-draw-lines',
    type: 'line',
    filter: [
      'any',
      ['==', '$type', 'LineString'],
      ['==', '$type', 'Polygon'],
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': [
        'case',
        ['==', ['get', 'active'], 'true'], blue,
        magenta,
      ],
      'line-dasharray': [
        'case',
        ['==', ['get', 'active'], 'true'], [0.2, 2],
        [2, 0],
      ],
      'line-width': 2,
    },
  },
  // Points
  //   Circle with an outline
  //   Active state defines size and color
  {
    id: 'gl-draw-point-outer',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
    ],
    paint: {
      'circle-radius': [
        'case',
        ['==', ['get', 'active'], 'true'], 10,
        8,
      ],
      'circle-color': white,
    },
  },
  {
    id: 'gl-draw-point-inner',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
    ],
    paint: {
      'circle-radius': [
        'case',
        ['==', ['get', 'active'], 'true'], 7,
        5,
      ],
      'circle-color': [
        'case',
        ['==', ['get', 'active'], 'true'], blue,
        magenta,
      ],
    },
  },
  // Vertex
  //   Visible when editing polygons and lines
  //   Similar behaviour to Points
  //   Active state defines size
  {
    id: 'gl-draw-vertex-outer',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'vertex'],
      ['!=', 'mode', 'simple_select'],
    ],
    paint: {
      'circle-radius': [
        'case',
        ['==', ['get', 'active'], 'true'], 7,
        5,
      ],
      'circle-color': white,
    },
  },
  {
    id: 'gl-draw-vertex-inner',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'vertex'],
      ['!=', 'mode', 'simple_select'],
    ],
    paint: {
      'circle-radius': [
        'case',
        ['==', ['get', 'active'], 'true'], 5,
        3,
      ],
      'circle-color': blue,
    },
  },
  // Midpoint
  //   Visible when editing polygons and lines
  //   Tapping or dragging them adds a new vertex to the feature
  {
    id: 'gl-draw-midpoint',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'midpoint'],
    ],
    paint: {
      'circle-radius': 3,
      'circle-color': blue,
    },
  },
];

export default styles;
