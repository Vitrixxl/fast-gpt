import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/auth/:path*',
        destination: '/auth/:path*',
      },
      {
        source: '/:path*',
        destination: '/client-app',
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
