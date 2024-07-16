import { CommunityData } from '@/types';
import {
  createContext, useMemo, useState,
} from 'react';

type Data = CommunityData & {
  onCommunityDataUpdated: (data: Partial<CommunityData>) => void
};

const CommunityContext = createContext<Data>({
  community: {
    id: '',
    creatorId: '',
    name: '',
    description: '',
  },
  campaigns: [],
  tasks: [],
  collaborators: [],
  annotations: [],
  onCommunityDataUpdated: () => {},
});

export default CommunityContext;

type Props = {
  initialData: Omit<CommunityData, 'onCommunityDataUpdated'>
};

export function CommunityProvider({
  initialData,
  children,
}: React.PropsWithChildren<Props>) {
  const [data, setData] = useState(initialData);

  const value = useMemo(() => ({
    ...data,
    onCommunityDataUpdated: (d: Partial<CommunityData>) => setData((old) => ({
      ...old,
      ...d,
    })),
  }), [data]);

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}
