import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/HeroSection'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { TableOfContents } from '@/components/TableOfContents'
import { JsonLd } from '@/components/JsonLd'
import { getBonusBySlug } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 3600

const BASE = 'https://oddsbonussen.dk'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const bonus = await getBonusBySlug(slug).catch(() => null)
  if (!bonus) return {}
  const title = bonus.metaTitle || bonus.title
  const description = bonus.metaDescription || bonus.intro || ''
  return { title, description, alternates: { canonical: `${BASE}/bonusser/${slug}` } }
}

export default async function BonusPage({ params }: Props) {
  const { slug } = await params
  const bonus = await getBonusBySlug(slug).catch(() => null)
  if (!bonus) notFound()

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
      <Footer />
    </>
  )
}
