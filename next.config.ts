import type { NextConfig } from "next";

// Note: the Pages Router `i18n` option was removed: it has no effect in the App Router.
const nextConfig: NextConfig = {
  // NEXT_DIST_DIR lets a verification build run in its own folder without
  // overwriting the .next folder a running `npm run dev` is using.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
