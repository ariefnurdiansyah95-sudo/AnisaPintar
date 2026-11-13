import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anisapintar.example'
  return ['', '/ulangan', '/hadiah', '/kreasi'].map((p) => ({ url: base + p, lastModified: new Date() }))
}
