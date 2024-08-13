import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TrackStoreData } from '@/types';

type Data = {
  handleTracking: (store: TrackStoreData) => void
};

const TrackingContext = createContext<Data>({
  handleTracking: () => {},
});

export default TrackingContext;

type Props = {
  initialStore: TrackStoreData[],
};

export function TrackingProvider({
  initialStore,
  children,
}: React.PropsWithChildren<Props>) {
  const [trackStore, updateTrackStore] = useState(initialStore);

  useEffect(() => {
    // TODO debounce calls to the db on trackStore update
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
  }, [trackStore]);

  const handleTracking = useCallback((d: TrackStoreData) => {
    updateTrackStore((old) => [
      ...old,
      d,
    ]);
  }, []);

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
