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

export const taskStatusDisplayNames = {
  todo: 'Not started',
  'in progress': 'In progress',
  done: 'Completed',
};

export type TaskStatus = keyof typeof taskStatusDisplayNames;

export function assertTaskStatus(s: string): asserts s is TaskStatus {
  if (!(s in taskStatusDisplayNames)) {
    throw new Error(`expected task status, got ${s}`);
  }
}

export const taskPriorityDisplayNames = {
  low: 'Low priority',
  medium: 'Normal priority',
  high: 'High priority',
};

export type TaskPriority = keyof typeof taskPriorityDisplayNames;

export function assertTaskPriority(p: string): asserts p is TaskPriority {
  if (!(p in taskPriorityDisplayNames)) {
    throw new Error(`expected task priority, got ${p}`);
  }
}
export type Task = {
  id: string
  name: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  date: Date | null
  campaignId: string
};
