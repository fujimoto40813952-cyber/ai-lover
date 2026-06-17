import type { MetadataRoute } from 'next'

const SITE_URL = 'https://ai-lover-psi.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // 認証後・APIは検索インデックス対象外
        disallow: ['/api/', '/select', '/chat/', '/auth/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
