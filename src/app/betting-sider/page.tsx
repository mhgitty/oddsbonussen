import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/HeroSection'
import { ComparisonTable } from '@/components/ComparisonTable'
import { AuthorBio } from '@/components/AuthorBio'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { TableOfContents } from '@/components/TableOfContents'
import { JsonLd } from '@/components/JsonLd'
import { getPageBySlug, getSiteSettings } from '@/lib/sanity'
import { replaceDateVars } from '@/lib/dateVars'
import type { Metadata } from 'next'

export const revalidate = 3600

const BASE = 'https://oddsbonussen.dk'
const CANONICAL = `${BASE}/betting-sider`

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('betting-sider').catch(() => null)
  const title = replaceDateVars(page?.metaTitle || page?.title || 'Bedste betting sider i Danmark')
  const description = replaceDateVars(page?.metaDescription || page?.intro || 'Sammenlign de bedste danske betting sider.')
  return { title, description, alternates: { canonical: CANONICAL } }
}

export default async function BettingSiderPage() {
  const [page, settings] = await Promise.all([
    getPageBySlug('betting-sider').catch(() => null),
    getSiteSettings().catch(() => null),
  ])
  const author = (page as any)?.author ?? settings?.defaultAuthor ?? null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Hjem', item: BASE },
          { '@type': 'ListItem', position: 2, name: page?.title || 'Betting sider', item: CANONICAL },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${CANONICAL}#webpage`,
        url: CANONICAL,
        name: page?.title || 'Betting sider',
        description: page?.intro || '',
        inLanguage: 'da-DK',
        publisher: { '@type': 'Organization', name: 'Oddsbonussen', url: BASE },
      },
    ],
  }

  if (!page) {
    return (
      <>
        <Navbar />
        <HeroSection title="Betting sider" intro="Oversigt over alle danske bookmakers." />
        {author && (
          <div className="section" style={{ paddingTop: '0' }}>
            <AuthorBio author={author} compact />
          </div>
        )}
        <Footer />
      </>
    )
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar />
      <HeroSection title={page.title} intro={page.intro} />

      {page.showComparisonTable && page.comparisonTable && (
        <div className="section" style={{ paddingBottom: page.body ? '0' : undefined }}>
          {page.comparisonTableTitle && (
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>
              {page.comparisonTableTitle}
            </h2>
          )}
          <ComparisonTable data={page.comparisonTable} />
        </div>
      )}

      {page.body && (
        <div className="article-layout">
          <article className="article-content">
            <PortableTextRenderer value={page.body} />
          </article>
          <aside className="toc-sidebar">
            <TableOfContents body={page.body} />
          </aside>
        </div>
      )}

      {author && (
        <div className="section" style={{ paddingTop: '0' }}>
          <AuthorBio author={author} compact />
        </div>
      )}

      <Footer />
    </>
  )
}
