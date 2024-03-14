import { GeoJSON } from 'geojson';

export type Community = {
  id: string
  name: string
  description: string
  defaultCampaignId: string
};

export type Campaign = {
  id: string
  communityId: string
  name: string
  description: string
};

export type Annotation = {
  id: string
  communityId: string
  name: string
  description: string
  type: 'infra' | 'equipment' | 'person' | 'poi' | 'region'
  visible: boolean
  geojson: GeoJSON
};

export type CampaignAnnotationPairing = {
  campaignId: string
  annotationId: string
};

export type Task = {
  id: string
  campaignId: string
  name: string
  description: string
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
