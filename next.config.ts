import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    appDir: true,
  },
  devIndicators: {
    buildActivity: false, // Disables the loading spinner
  },
};

export default nextConfig;
