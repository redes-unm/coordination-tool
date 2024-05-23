import { Annotation, Community } from '@/types';
import { createContext } from 'react';

const CommunityContext = createContext<Community & {
  campaigns: { id: string, name: string, default: boolean }[]
  taskCount: number
  collaboratorCount: number
  annotations: Annotation[]
}>({
  id: '',
  creatorId: '',
  name: '',
  description: '',
  campaigns: [],
  taskCount: 0,
  collaboratorCount: 0,
  annotations: [],
});

export default CommunityContext;
