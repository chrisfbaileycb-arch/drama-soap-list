import { useState, useCallback, useRef } from 'react';
import { discoverNewPlatforms } from '@/services/appStoreDiscovery';
import { Platform } from '@/constants/dramaData';

export interface DiscoveryState {
  isRefreshing: boolean;
  newCount: number;
  lastRefreshed: Date | null;
  error: string | null;
}

export function useDiscovery(
  existingPlatforms: Platform[],
  onNewPlatforms: (platforms: Platform[]) => void
) {
  const [state, setState] = useState<DiscoveryState>({
    isRefreshing: false,
    newCount: 0,
    lastRefreshed: null,
    error: null,
  });

  // Track IDs already loaded so we never re-add them
  const seenIds = useRef<Set<string>>(new Set(existingPlatforms.map(p => p.id)));

  const runDiscovery = useCallback(async () => {
    setState(prev => ({ ...prev, isRefreshing: true, error: null }));
    try {
      // Keep the seen set current with latest platforms
      for (const p of existingPlatforms) seenIds.current.add(p.id);

      const result = await discoverNewPlatforms(seenIds.current);

      if (result.platforms.length > 0) {
        // Mark these IDs as seen so pull-to-refresh doesn't re-add them
        for (const p of result.platforms) seenIds.current.add(p.id);

        onNewPlatforms(result.platforms);
        setState({ isRefreshing: false, newCount: result.platforms.length, lastRefreshed: new Date(), error: null });
      } else {
        setState({ isRefreshing: false, newCount: 0, lastRefreshed: new Date(), error: null });
      }
    } catch (e: any) {
      setState(prev => ({ ...prev, isRefreshing: false, error: e?.message ?? 'Discovery failed' }));
    }
  }, [existingPlatforms, onNewPlatforms]);

  return { ...state, runDiscovery };
}
