import {
  createContext, useCallback, useEffect, useMemo, useState,
} from 'react';

import { TrackStoreData } from '@/types';

type Data = {
  handleTracking: (store: Omit<TrackStoreData, 'userId'>) => void
};

const TrackingContext = createContext<Data>({
  handleTracking: () => {},
});

export default TrackingContext;

type Props = {
  initialStore: TrackStoreData[],
  userId: string,
};

export function TrackingProvider({
  initialStore,
  children,
  userId,
}: React.PropsWithChildren<Props>) {
  const [trackStore, updateTrackStore] = useState(initialStore);

  useEffect(() => {
    // TODO debounce calls to the db on trackStore update
    /* eslint-disable no-console */
    console.info('**** trackStore updated:');
    trackStore.map((item, i) => {
      console.info(`**** ${i}`);
      console.info(`    --> element: ${item.element}`);
      console.info(`    --> event: ${item.event}`);
      console.info(`    --> page: ${item.page}`);
      console.info(`    --> timestamp: ${item.timestamp}`);
      console.info(`    --> userId: ${item.userId}`);
    });
    console.info('**** [end store log]');
    /* eslint-enable no-console */
  }, [trackStore]);

  const handleTracking = useCallback((d: Omit<TrackStoreData, 'userId'>) => {
    updateTrackStore((old) => [
      ...old,
      {
        ...d,
        userId,
      },
    ]);
  }, [userId]);

  const value = useMemo(() => ({
    handleTracking,
    // NOTE we do not need to expose the trackStore
  }), [handleTracking]);

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
}
