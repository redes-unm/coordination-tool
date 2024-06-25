import { Geometry } from 'geojson';

export type Community = {
  id: string
  creatorId: string | null
  name: string
  description: string
  mapCenter?: [number, number] | undefined
};

export type CommunityData = {
  community: Community
  campaigns: Campaign[]
  tasks: Task[]
  collaborators: Collaborator[]
  annotations: Annotation[]
};

export type Collaborator = {
  id: string
  communityId: string
  userId?: string | undefined
  name: string
  role: string
  editable: boolean
};

export const campaignTypeDisplayNames = {
  education: 'Education',
  event: 'Event',
  measurement: 'Measurement',
  other: 'Other',
};

export type CampaignType = keyof typeof campaignTypeDisplayNames;

export function assertCampaignType(t: string): asserts t is CampaignType {
  if (!(t in campaignTypeDisplayNames)) {
    throw new Error(`expected campaign type, got ${t}`);
  }
}

export type Campaign = {
  id: string
  name: string
  description: string
  type: CampaignType
  communityId: string
  default: boolean
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
  campaignIds: string[]
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

export type Profile = {
  userId: string
  name: string
};
