/**
 * Absolute origin used by canonical, Open Graph, robots.txt and sitemap.xml.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL      — explicit override (use once a custom domain is live)
 *   2. VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL — injected by Vercel at build time,
 *      so a deployment is correct with no configuration at all. Without this the
 *      production build shipped `http://localhost:3000` in every canonical tag,
 *      every og: url and inside robots.txt.
 *   3. localhost — local development only.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) {
    return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
  }

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
