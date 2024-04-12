import { Geometry } from 'geojson';

export type Community = {
  id: string
  name: string
  description: string
};

export type Campaign = {
  id: string
  name: string
  description: string
  communityId: string
};

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
  description: string
  type: AnnotationType
  geometry: Geometry
};

export function assertAnnotationType(t: string): asserts t is AnnotationType {
  if (!(t in annotationTypeDisplayNames)) {
    throw new Error(`expected annotation type, got ${t}`);
  }
}

export type Task = {
  id: string
  name: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in progress' | 'done'
};
