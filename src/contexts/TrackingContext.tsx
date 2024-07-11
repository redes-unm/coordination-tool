import { createContext, useMemo, useState } from 'react';

import { TrackStoreData } from '@/types';

type Data = {
  trackStore: TrackStoreData[],
  handleTracking: (store: TrackStoreData) => void
};

const TrackingContext = createContext<Data>({
  trackStore: [],
  handleTracking: () => {},
  // TODO should we have a separate function for saving multiple events at once?
});

export default TrackingContext;

type Props = {
  initialStore: TrackStoreData[]
};

export function TrackingProvider({
  initialStore,
  children,
}: React.PropsWithChildren<Props>) {
  const [trackStore, updateTrackStore] = useState(initialStore);

  const value = useMemo(() => ({
    trackStore,
    handleTracking: (d: TrackStoreData) => {
      // console.log('inside handleTracking');
      updateTrackStore((old) => [
        ...old,
        d,
      ]);
    },
  }), [trackStore]);

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
}
