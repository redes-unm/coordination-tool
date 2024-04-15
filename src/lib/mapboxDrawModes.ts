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
  simple_select: 'Select',
  draw_polygon: 'Draw polygon',
  draw_point: 'Draw point',
  draw_line_string: 'Draw line',
  draw_rectangle: 'Draw rectangle',
};

export function assertMode(m: string): asserts m is Mode {
  if (!(m in modes)) {
    throw new Error(`expected mapbox draw mode, got ${m}`);
  }
}
