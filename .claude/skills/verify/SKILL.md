---
name: verify
description: Verify a NextResume change (type-check, lint, production build) without disturbing the user's running dev or production server. Use before every commit, or when asked to "check", "build" or "make sure it works".
---

# Verify a change

The user often has `npm run dev` (port 3000, folder `.next-dev`) or `npm start` (folder `.next`) running. A normal `npm run build` or `rm -rf .next` breaks those servers, so verification always builds into its own folder.

## Steps

1. Keep a copy of `tsconfig.json` (Next rewrites it when it sees a new dist folder):
   ```bash
   cp tsconfig.json /tmp/tsconfig.keep
   ```
2. Type-check and lint (lint must report **0 errors**; existing warnings are legacy):
   ```bash
   npx tsc --noEmit
   npm run lint 2>&1 | grep -c " Error"
   ```
3. Isolated production build with placeholder env (real values are not needed to compile):
   ```bash
   NEXT_DIST_DIR=.next-verify MONGODB_URI=mongodb://127.0.0.1:27017/ci NEXTAUTH_SECRET=x \
   NEXTAUTH_URL=http://localhost:3137 GOOGLE_CLIENT_ID=x GOOGLE_CLIENT_SECRET=x \
   npm run build > /tmp/build.log 2>&1; echo "exit=$?"
   ```
   On failure read `/tmp/build.log`. A `PageNotFoundError` usually means another process is writing the same dist folder: use a fresh `NEXT_DIST_DIR`.
4. Clean up:
   ```bash
   cp /tmp/tsconfig.keep tsconfig.json
   rm -rf .next-verify
   git status --short   # tsconfig.json must not appear
   ```

## Rules

- Never run `rm -rf .next`, `rm -rf .next-dev` or a plain `npm run build`.
- If you start a server to test (`next start -p 31xx`), stop it **by port**:
  `Get-NetTCPConnection -LocalPort 31xx -State Listen | % { Stop-Process -Id $_.OwningProcess -Force }`.
  Never kill node processes by matching the project path: that kills the user's server too.
- Report results plainly: say what passed, and say what was not tested (for example anything that needs a real Google sign-in or MongoDB).
