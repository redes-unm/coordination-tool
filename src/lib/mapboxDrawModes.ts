import MapboxDraw from '@mapbox/mapbox-gl-draw';
import FreehandMode from './FreehandMode';
import RectangleMode from './RectangleMode';
import SelectMode from './SelectMode';

const modes = {
  simple_select: SelectMode,
  draw_polygon: FreehandMode,
  draw_point: MapboxDraw.modes.draw_point,
  draw_line_string: MapboxDraw.modes.draw_line_string,
  draw_rectangle: RectangleMode,
};
export default modes;

export type Mode = keyof typeof modes;

export const modeDisplayNames: { [k in Mode]: string } = {
  simple_select: 'Simple select',
  draw_polygon: 'Polygon',
  draw_point: 'Point',
  draw_line_string: 'Line',
  draw_rectangle: 'Rectangle',
};

export function assertMode(m: string): asserts m is Mode {
  if (!(m in modes)) {
    throw new Error(`expected mapbox draw mode, got ${m}`);
  }
}
