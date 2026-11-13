import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.brand} — ${SITE.tagline}`, short_name: SITE.brand, description: SITE.description,
    start_url: '/', display: 'standalone', orientation: 'portrait', background_color: '#FFF8E7', theme_color: '#6C5CE7', lang: 'id',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
