/**
 * sitemap.xml — generated from the one route map (src/lib/routes.ts) plus the
 * dynamic resort detail pages. Both languages, self-canonical URLs only.
 *
 * A static endpoint, so it is always in step with ROUTES — no second list to
 * keep in sync, no extra dependency, no client JS.
 */
import type { APIRoute } from "astro";
import { ROUTES, resortDetailPath } from "../lib/routes";
import { RESORTS } from "../data/resorts";
import { SITE_URL } from "../data/config";

export const GET: APIRoute = () => {
  const paths = new Set<string>();

  for (const def of Object.values(ROUTES)) {
    paths.add(def.bm);
    paths.add(def.en);
  }
  for (const r of RESORTS) {
    paths.add(resortDetailPath(r.slug, "bm"));
    paths.add(resortDetailPath(r.slug, "en"));
  }

  const urls = [...paths]
    .sort()
    .map((p) => `  <url><loc>${new URL(p, SITE_URL).href}</loc></url>`)
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
