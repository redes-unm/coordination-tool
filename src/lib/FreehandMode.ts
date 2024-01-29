// FREEHAND MODE
// Source: https://github.com/bemky/mapbox-gl-draw-freehand-mode
//         https://github.com/bemky/mapbox-gl-draw-freehand-mode/issues/25
//         plus converted to TS and modified by us
//
// Copyright (c) Mapbox
// Copyright (c) 2017 Ben Ehmke
//
// All rights reserved.
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
// OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

/* eslint-disable no-param-reassign -- MapboxDraw modes need to modify state param */

import MapboxDraw, { DrawCustomMode, DrawCustomModeThis, DrawPolygon } from '@mapbox/mapbox-gl-draw';
import simplify from '@turf/simplify';

const {
  geojsonTypes, cursors, types, updateActions, modes, events,
} = MapboxDraw.constants;

const FreehandMode: DrawCustomMode & {
  onPointerEnd(this: DrawCustomModeThis & typeof FreehandMode, state: any): void
  fireUpdate(this: DrawCustomModeThis & typeof FreehandMode): void
  simplify(this: DrawCustomModeThis & typeof FreehandMode, p: DrawPolygon): DrawPolygon
} = {
  ...MapboxDraw.modes.draw_polygon,

  onSetup() {
    const polygon = this.newFeature({
      type: geojsonTypes.FEATURE,
      properties: {},
      geometry: {
        type: geojsonTypes.POLYGON,
        coordinates: [[]],
      },
    });

    this.addFeature(polygon);
    this.clearSelectedFeatures();
    MapboxDraw.lib.doubleClickZoom.disable(this);

    // disable dragPan
    setTimeout(() => {
      if (!this.map || !this.map.dragPan) return;
      this.map.dragPan.disable();
    }, 0);

    this.updateUIClasses({ mouse: cursors.ADD });
    this.activateUIButton(types.POLYGON);
    this.setActionableState({
      trash: true,
      combineFeatures: false,
      uncombineFeatures: false,
    });

    return {
      polygon,
      currentVertexPosition: 0,
      dragMoving: false,
    };
  },

  onDrag(state, e) {
    state.dragMoving = true;
    this.updateUIClasses({ mouse: cursors.ADD });
    state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
    state.currentVertexPosition += 1;
    state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
  },

  onMouseUp(state) {
    this.onPointerEnd(state);
  },

  onTouchEnd(state) {
    this.onPointerEnd(state);
  },

  onPointerEnd(state) {
    if (state.dragMoving) {
      this.simplify(state.polygon);
      this.fireUpdate();
      this.changeMode(modes.SIMPLE_SELECT, { featureIds: [state.polygon.id] });
    }
  },

  fireUpdate() {
    if (!this.getSelected().length) {
      return;
    }

    this.map.fire(events.UPDATE, {
      action: updateActions.MOVE,
      features: this.getSelected().map((f) => f.toGeoJSON()),
    });
  },

  simplify(polygon) {
    // increase base to make shapes more true to drawing
    const tolerance = 1 / 1.05 ** (10 * this.map.getZoom()); // https://www.desmos.com/calculator/nolp0g6pwr
    return simplify(polygon, { tolerance, highQuality: true });
  },

  onStop(state) {
    MapboxDraw.modes.draw_polygon.onStop?.call(this, state);
    MapboxDraw.lib.doubleClickZoom.enable(this);
    setTimeout(() => {
      if (!this.map || !this.map.dragPan) return;
      this.map.dragPan.enable();
    }, 0);
  },
};

export default FreehandMode;
