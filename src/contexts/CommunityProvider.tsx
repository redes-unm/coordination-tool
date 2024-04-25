'use client';

import CommunityContext from '@/contexts/CommunityContext';

type Props = {
  value: React.ContextType<typeof CommunityContext>
};

export default function CommunityProvider({
  value,
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}
