import { createContext, useMemo, useState } from 'react';

const BreadcrumbContext = createContext({
  key: 0,
  update: () => {},
});

export default BreadcrumbContext;

export function BreadcrumbProvider({ children }: React.PropsWithChildren<{}>) {
  const [key, setKey] = useState(0);
  const value = useMemo(() => ({ key, update: () => setKey((k) => k + 1) }), [key]);

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}
