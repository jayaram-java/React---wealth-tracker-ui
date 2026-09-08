import { useSyncExternalStore } from 'react';
import {
  subscribeToLoader,
  getActiveRequestCount,
  resetLoader,
} from '../../serviceconfigs/AxiosAPI';

/**
 * Custom hook to consume the global API loading state and active request count.
 * Leverages React's useSyncExternalStore for concurrent-safe subscription.
 */
export const useApiLoader = () => {
  const activeCount = useSyncExternalStore(
    subscribeToLoader,
    getActiveRequestCount,
    getActiveRequestCount
  );
  const isLoading = activeCount > 0;

  return { isLoading, activeCount, resetLoader };
};

export default useApiLoader;
