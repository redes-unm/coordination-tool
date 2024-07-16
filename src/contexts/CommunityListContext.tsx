import { Community } from '@/types';
import { createContext, useMemo, useState } from 'react';

type Data = {
  communities: (Community & { collaboratorCount: number })[]
  onCommunityUpdated: (c: (Community & { collaboratorCount: number })) => void
  onCommunityDeleted: (id: string) => void
};

const CommunityListContext = createContext<Data>({
  communities: [],
  onCommunityUpdated: () => {},
  onCommunityDeleted: () => {},
});

export default CommunityListContext;

type Props = {
  initialData: Data['communities']
};

export function CommunityListProvider({
  initialData,
  children,
}: React.PropsWithChildren<Props>) {
  const [communities, setCommunities] = useState(initialData);

  const value = useMemo(() => ({
    communities,
    onCommunityUpdated: (community: (Community & { collaboratorCount: number })) => {
      setCommunities((old) => {
        const updated = old.slice();
        const i = updated.findIndex((c) => c.id === community.id);
        if (i >= 0) {
          updated[i] = community;
        } else {
          updated.push(community);
        }
        return updated;
      });
    },
    onCommunityDeleted: (id: string) => setCommunities(
      (old) => old.filter((o) => o.id !== id),
    ),
  }), [communities]);

  return (
    <CommunityListContext.Provider value={value}>
      {children}
    </CommunityListContext.Provider>
  );
}
