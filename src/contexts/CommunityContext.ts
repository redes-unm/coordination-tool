import { Annotation, Collaborator, Community } from '@/types';
import { createContext } from 'react';

export type CommunityPlus = Community & {
  campaigns: { id: string, name: string, default: boolean }[]
  taskCount: number
  collaborators: Collaborator[]
  annotations: Annotation[]
};

type Data = {
  community: CommunityPlus
  onCommunityUpdated: (c: CommunityPlus) => void
};

const CommunityContext = createContext<Data>({
  community: {
    id: '',
    creatorId: '',
    name: '',
    description: '',
    campaigns: [],
    taskCount: 0,
    collaborators: [],
    annotations: [],
  },
  onCommunityUpdated: () => {},
});

export default CommunityContext;
