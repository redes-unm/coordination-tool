import { Annotation as BaseAnnotation } from '@/types';

export type Community = {
  id: string
  name: string
  defaultCampaignId: string
};

export type Campaign = {
  id: string
  communityId: string
  name: string
};

export type Annotation = BaseAnnotation & {
  communityId: string
  visible: boolean
};

export type CampaignAnnotationPairing = {
  campaignId: string
  annotationId: string
};

export type Task = {
  id: string
  campaignId: string
  name: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in progress' | 'done'
};

export type User = {
  id: string
  email: string
  name: string
};

export type Collaborator = {
  communityId: string
  userId: string
};
