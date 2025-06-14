'use client';

import LogRocket from 'logrocket';

export function initLogRocket() {
  const logrocketId = process.env.NEXT_PUBLIC_LOGROCKET_ID;
  const environment = process.env.NEXT_PUBLIC_VERCEL_ENV || 'local';

  if (!logrocketId) {
    console.warn('[LogRocket] NEXT_PUBLIC_LOGROCKET_ID가 설정되지 않았습니다.');
    return;
  }

  if (typeof window !== 'undefined') {
    LogRocket.init(logrocketId);
    LogRocket.identify('anonymous', {
      environment: environment,
    });
    console.log(`[LogRocket] 초기화 완료: 환경 - ${environment}`);
  }
}
