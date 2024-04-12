import { DrawCustomMode } from '@mapbox/mapbox-gl-draw';
import { assertGeoJSONFeature } from './util';

type Options = { featureIds?: string[] };

const SelectMode: DrawCustomMode<null, Options> = {
  onSetup(opts) {
    if (opts.featureIds && opts.featureIds.length !== 1) {
      throw Error(`expected a single feature id in opts, got ${opts.featureIds.length}`);
    }

    this.setSelected(opts.featureIds?.[0]);
    return null;
  },

  toDisplayFeatures(_state, geojson, display) {
    assertGeoJSONFeature(geojson);
    // eslint-disable-next-line no-param-reassign -- it's normal in mapbox draw
    geojson.properties.active = geojson.properties.id && this.isSelected(geojson.properties.id)
      ? 'true'
      : 'false';
    display(geojson);
  },

  onClick(_state, e) {
    this.setSelected(e.featureTarget?.properties?.['id']?.toString());
  },

  onTap(_state, e) {
    this.setSelected(e.featureTarget?.properties?.['id']?.toString());
  },
};

export default SelectMode;
