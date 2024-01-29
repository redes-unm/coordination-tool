// RECTANGLE MODE
// Source: https://github.com/thegisdev/mapbox-gl-draw-rectangle-mode
//         plus converted to TS and modified by us
//
//
// README.md and package.json say MIT license. No copyright notice.

/* eslint-disable no-param-reassign -- MapboxDraw modes need to modify state param */

import MapboxDraw, {
  DrawCustomModeThis, DrawFeature, DrawPolygon, DrawCustomMode,
} from '@mapbox/mapbox-gl-draw';
import { Feature, GeoJSON, Geometry } from 'geojson';
import { LngLat, Point } from 'mapbox-gl';

type State = {
  startPoint?: Point
  rectangle: DrawPolygon
};

function assertDrawPolygon(f: DrawFeature): asserts f is DrawPolygon {
  if (f.type !== 'Polygon') {
    throw Error(`expected Polygon, got ${f.type}`);
  }
}

function assertGeoJSONFeature(
  g: GeoJSON,
): asserts g is Feature<Geometry, { id?: string, active?: string }> {
  if (g.type !== 'Feature') {
    throw Error(`expected Feature, got ${g.type}`);
  }

  if (!g.properties || typeof g.properties !== 'object') {
    throw Error('expected non-null properties');
  }
}
const RectangleMode: DrawCustomMode<State> & {
  onPointerClick(
    this: DrawCustomModeThis & typeof RectangleMode,
    state: any,
    e: { lngLat: LngLat },
  ): void
  onPointerMove(
    this: DrawCustomModeThis & typeof RectangleMode,
    state: any,
    e: { lngLat: LngLat },
  ): void
} = {
  // When the mode starts this function will be called.
  onSetup() {
    const rectangle = this.newFeature({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[]],
      },
    });
    assertDrawPolygon(rectangle);
    this.addFeature(rectangle);
    this.clearSelectedFeatures();
    MapboxDraw.lib.doubleClickZoom.disable(this);
    this.updateUIClasses({ mouse: 'add' });
    this.setActionableState({
      trash: true,
      combineFeatures: false,
      uncombineFeatures: false,
    });
    return {
      rectangle,
    };
  },

  // support mobile taps
  onTap(state, e) {
    // emulate 'move mouse' to update feature coords
    if (state.startPoint) this.onPointerMove(state, e);

    // emulate onClick
    this.onPointerClick(state, e);
  },

  // Whenever a user clicks on the map, Draw will call `onClick`
  onClick(state, e) {
    this.onPointerClick(state, e);
  },

  onPointerClick(state, e) {
    // if state.startPoint exist, means its second click
    // change to  simple_select mode
    if (
      state.startPoint
        && state.startPoint[0] !== e.lngLat.lng
        && state.startPoint[1] !== e.lngLat.lat
    ) {
      this.updateUIClasses({ mouse: 'pointer' });
      state.endPoint = [e.lngLat.lng, e.lngLat.lat];
      this.changeMode('simple_select', { featuresId: state.rectangle.id });
    }
    // on first click, save clicked point coords as starting for  rectangle
    const startPoint = [e.lngLat.lng, e.lngLat.lat];
    state.startPoint = startPoint;
  },

  onMouseMove(state, e) {
    this.onPointerMove(state, e);
  },

  onPointerMove(state, e) {
    // if startPoint, update the feature coordinates, using the bounding box concept
    // we are simply using the startingPoint coordinates and the current Mouse Position
    // coordinates to calculate the bounding box on the fly, which will be our rectangle
    if (state.startPoint) {
      state.rectangle.updateCoordinate(
        '0.0',
        state.startPoint[0],
        state.startPoint[1],
      ); // minX, minY - the starting point
      state.rectangle.updateCoordinate(
        '0.1',
        e.lngLat.lng,
        state.startPoint[1],
      ); // maxX, minY
      state.rectangle.updateCoordinate('0.2', e.lngLat.lng, e.lngLat.lat); // maxX, maxY
      state.rectangle.updateCoordinate(
        '0.3',
        state.startPoint[0],
        e.lngLat.lat,
      ); // minX,maxY
      state.rectangle.updateCoordinate(
        '0.4',
        state.startPoint[0],
        state.startPoint[1],
      ); // minX,minY - ending point (equals to starting point)
    }
  },

  // Whenever a user clicks on a key while focused on the map, it will be sent here
  onKeyUp(_state, e) {
    if (e.key === 'Escape') {
      this.changeMode('simple_select');
    }
  },

  onStop(state) {
    MapboxDraw.lib.doubleClickZoom.enable(this);
    this.updateUIClasses({ mouse: 'none' });
    this.activateUIButton();

    // check to see if we've deleted this feature
    if (this.getFeature(`${state.rectangle.id}`) === undefined) return;

    // remove last added coordinate
    state.rectangle.removeCoordinate('0.4');
    if (state.rectangle.isValid()) {
      this.map.fire('draw.create', {
        features: [state.rectangle.toGeoJSON()],
      });
    } else {
      this.deleteFeature(`${state.rectangle.id}`, { silent: true });
      this.changeMode('simple_select', {}, { silent: true });
    }
  },

  toDisplayFeatures(state, geojson, display) {
    assertGeoJSONFeature(geojson);
    const isActivePolygon = geojson.properties.id === state.rectangle.id;
    geojson.properties.active = isActivePolygon ? 'true' : 'false';
    if (!isActivePolygon) {
      display(geojson);
      return;
    }

    // Only render the rectangular polygon if it has the starting point
    if (!state.startPoint) return;
    display(geojson);
  },

  onTrash(state) {
    this.deleteFeature(`${state.rectangle.id}`, { silent: true });
    this.changeMode('simple_select');
  },
};

export default RectangleMode;
