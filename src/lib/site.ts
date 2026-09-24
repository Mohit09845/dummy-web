// Single source of truth for the deployed origin. Static export builds
// (output: "export") have no server to resolve this at request time, so it
// must be baked in at build time via this env var — set it in the deploy
// pipeline before running `next build`, otherwise sitemap/canonical/OG URLs
// fall back to localhost.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const SITE_NAME = 'Sunfeast Dark Fantasy Beverages';
