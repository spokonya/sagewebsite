import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/** Absolute project root (directory containing this file). Avoids `process.cwd()` drift under npm/pnpm. */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin tracing to this repo so Next does not walk a parent folder with another lockfile.
  outputFileTracingRoot: projectRoot,
  // ESLint during `next build` can hang or fail on ESLint 9 + flat-config edge cases; `npm run lint` uses tsc.
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
