import type { NextConfig } from "next";

// Note: the Pages Router `i18n` option was removed: it has no effect in the App Router.
const nextConfig: NextConfig = {
  // `npm run dev` and `npm run build`/`start` must not share a folder: each
  // overwrites the other's files, so a dev server and a production server
  // running side by side drift apart (stale pages, old components).
  // Dev writes to .next-dev, the production build to .next (what Vercel uses).
  // NEXT_DIST_DIR overrides both, e.g. for a throwaway verification build.
  distDir: process.env.NEXT_DIST_DIR || (process.env.NODE_ENV === "development" ? ".next-dev" : ".next"),
};

export default nextConfig;
