import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // 모든 호스트에서 접근 가능하도록 설정
  // Docker 컨테이너 내에서 실행될 때 필요함
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
};

export default nextConfig;
