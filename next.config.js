/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js';

/** @type {import("next").NextConfig} */
const config = {
  output: 'standalone',
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

  // typescript:const {
  //   // !! WARN !!
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   // !! WARN !!
  //   ignoreBuildErrors: true,
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
