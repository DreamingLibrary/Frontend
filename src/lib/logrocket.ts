'use client';

import LogRocket from 'logrocket';

export function initLogRocket() {
  const logrocketId = process.env.NEXT_PUBLIC_LOGROCKET_ID;
  const environment = process.env.NEXT_PUBLIC_VERCEL_ENV || 'local';

  if (typeof window !== 'undefined' && logrocketId) {
    LogRocket.init(logrocketId);
    LogRocket.identify('anonymous', {
      environment: environment,
    });
  }
}
