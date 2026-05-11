import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/HeroSection'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { TableOfContents } from '@/components/TableOfContents'
import { AuthorBio } from '@/components/AuthorBio'
import { JsonLd } from '@/components/JsonLd'
import { getBonusBySlug, getSiteSettings, client } from '@/lib/sanity'
import { replaceDateVars } from '@/lib/dateVars'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 3600

const BASE = 'https://oddsbonussen.dk'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const bonuses = await client.fetch<Array<{ slug: { current: string } }>>(
    `*[_type == "bonus" && active == true && defined(slug.current)] { slug }`
  ).catch(() => [])
  return bonuses.map((b) => ({ slug: b.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const bonus = await getBonusBySlug(slug).catch(() => null)
  if (!bonus) return {}
  const title = replaceDateVars(bonus.metaTitle || bonus.title)
  const description = replaceDateVars(bonus.metaDescription || bonus.intro || '')
  const canonical = `${BASE}/bonusser/${slug}`
  const img = bonus.ogImage?.url ? bonus.ogImage
    : bonus.kampagneBillede?.url ? bonus.kampagneBillede
    : bonus.casinoLogo?.url ? bonus.casinoLogo
    : null
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      ...(img ? { images: [{ url: img.url, alt: img.alt || title }] } : {}),
    },
    twitter: {
      title,
      description,
      ...(img ? { images: [img.url] } : {}),
    },
  }
}

export default async function BonusPage({ params }: Props) {
  const { slug } = await params
  const [bonus, settings] = await Promise.all([
    getBonusBySlug(slug).catch(() => null),
    getSiteSettings().catch(() => null),
  ])
  if (!bonus) notFound()
  const author = settings?.defaultAuthor ?? null

  const canonical = `${BASE}/bonusser/${slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Hjem', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Bonusser', item: `${BASE}/bonusser` },
          { '@type': 'ListItem', position: 3, name: bonus.title, item: canonical },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: bonus.title,
        description: bonus.metaDescription || bonus.intro || '',
        inLanguage: 'da-DK',
        publisher: { '@type': 'Organization', name: 'Oddsbonussen', url: BASE },
      },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar />
      <HeroSection title={bonus.title} intro={bonus.intro} />
      <div className="article-layout">
        <article className="article-content">
          {bonus.body && <PortableTextRenderer value={bonus.body} />}
        </article>
        {bonus.body && (
          <aside className="toc-sidebar">
            <TableOfContents body={bonus.body} />
          </aside>
        )}
      </div>
      {author && (
        <div className="section" style={{ paddingTop: '0' }}>
          <AuthorBio author={author} compact />
        </div>
      )}
      <Footer />
    </>
  )
}
