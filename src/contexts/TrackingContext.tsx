import debounce from 'debounce';
import {
  createContext, useCallback, useEffect, useMemo, useState,
} from 'react';

import { TrackStoreData, UNAUTH_USER_ID } from '@/types';
import { newDb } from '@/db/client';

const DEBUG = process.env.NODE_ENV !== 'production';

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

  const debounceMillis = 500;
  const writeTrackStore = useMemo(() => debounce(async (store: TrackStoreData[]) => {
    try {
      await newDb().insertTrackStoreData(store);
      updateTrackStore([]);
    } catch {
      // ignore for now
    }
  }, debounceMillis), []);

  useEffect(() => {
    if (DEBUG) {
      /* eslint-disable no-console */
      console.info('**** trackStore updated:');
      trackStore.forEach((item, i) => {
        console.info(`**** ${i}`);
        console.info(`    --> element: ${item.element}`);
        console.info(`    --> event: ${item.event}`);
        console.info(`    --> page: ${item.page}`);
        console.info(`    --> timestamp: ${item.timestamp}`);
        console.info(`    --> userId: ${item.userId}`);
      });
      console.info('**** [end store log]');
      /* eslint-enable no-console */
    }

    if (trackStore && trackStore.length !== 0 && !DEBUG) {
      writeTrackStore(trackStore);
    }
  }, [trackStore, writeTrackStore]);

  const handleTracking = useCallback((d: Omit<TrackStoreData, 'userId'>) => {
    if (userId !== UNAUTH_USER_ID) {
      /* We want to ignore any updates from unauthenticated users because,
       * otherwise, we would have to allow anybody to insert any tracking event
       * to the database without logging in. */
      updateTrackStore((old) => [
        ...old,
        {
          ...d,
          userId,
        },
      ]);
    }
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
