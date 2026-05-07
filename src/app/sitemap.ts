import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

export const revalidate = 86400

const BASE = 'https://oddsbonussen.dk'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pages, bookmakers, bonusser] = await Promise.all([
    client.fetch<Array<{ slug: { current: string }; publishedAt?: string; lastUpdated?: string }>>(
      `*[_type == "post" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) { slug, publishedAt, lastUpdated }`
    ).catch(() => []),
    client.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "page" && defined(slug.current)] { slug }`
    ).catch(() => []),
    client.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "bookmaker" && defined(slug.current)] { slug }`
    ).catch(() => []),
    client.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "bonus" && defined(slug.current)] { slug }`
    ).catch(() => []),
  ])

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/betting-sider`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/bonusser`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/blog`, changeFrequency: 'daily', priority: 0.8 },
    ...bookmakers.map((b) => ({
      url: `${BASE}/betting-sider/${b.slug.current}`,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...bonusser.map((b) => ({
      url: `${BASE}/bonusser/${b.slug.current}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug.current}`,
      lastModified: p.lastUpdated ? new Date(p.lastUpdated) : p.publishedAt ? new Date(p.publishedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...pages.map((p) => ({
      url: `${BASE}/${p.slug.current}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]
}
