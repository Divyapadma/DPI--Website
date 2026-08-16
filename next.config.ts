import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All project/blog/hero images are hosted on ImageKit and stored as
    // full URLs in Supabase — ImageKit does its own resizing/format
    // negotiation via `?tr=` params, so we hand off to it directly
    // instead of Next's built-in optimizer. See lib/imagekit-loader.ts.
    loader: "custom",
    loaderFile: "./lib/imagekit-loader.ts",
  },
};

export default nextConfig;
