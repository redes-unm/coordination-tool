import { Geometry } from 'geojson';

export const annotationTypeDisplayNames = {
  infra: 'infrastructure',
  equipment: 'equipment',
  person: 'person',
  poi: 'point of interest',
  region: 'region',
};

export type AnnotationType = keyof typeof annotationTypeDisplayNames;

export type Annotation = {
  id: string
  name: string
  type: AnnotationType
  geometry: Geometry
};

export function assertAnnotationType(t: string): asserts t is AnnotationType {
  if (!(t in annotationTypeDisplayNames)) {
    throw new Error(`expected annotation type, got ${t}`);
  }
}
