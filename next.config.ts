import type { NextConfig } from "next";
const PWA = require("@ducanh2912/next-pwa");
const defaultRuntimeCaching = PWA.runtimeCaching;

const withPWA = PWA.default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/.*\/api\/proxy-audio/,
      handler: "CacheFirst",
      options: {
        cacheName: "proxy-audio-cache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    ...defaultRuntimeCaching,
  ],
});

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default withPWA(nextConfig);
