/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js';

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    reactCompiler: true,
  },
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
};

export default config;
