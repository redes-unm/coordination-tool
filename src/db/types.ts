import { GeoJSON } from 'geojson';

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

export type Annotation = {
  id: string
  communityId: string
  name: string
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
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in progress' | 'done'
};
