'use client';

import { initLogRocket } from '@/lib/logrocket';
import { useEffect } from 'react';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('[LogRocket] Initializing...');
    initLogRocket();
  }, []);

  return <>{children}</>;
}
