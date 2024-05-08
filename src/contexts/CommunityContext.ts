import { Annotation, Community } from '@/types';
import { createContext } from 'react';

const CommunityContext = createContext<Community & {
  campaignCount: number
  taskCount: number
  collaboratorCount: number
  annotations: Annotation[]
}>({
  id: '',
  name: '',
  description: '',
  campaignCount: 0,
  taskCount: 0,
  collaboratorCount: 0,
  annotations: [],
});

export default CommunityContext;
