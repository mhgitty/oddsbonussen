import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { BookmakerCard } from '@/components/BookmakerCard'
import { PostCard } from '@/components/PostCard'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { TableOfContents } from '@/components/TableOfContents'
import { JsonLd } from '@/components/JsonLd'
import { getBookmakers, getPosts, getHomepage } from '@/lib/sanity'
import type { Metadata } from 'next'

export const revalidate = 3600

const BASE = 'https://oddsbonussen.dk'

export async function generateMetadata(): Promise<Metadata> {
  const hp = await getHomepage().catch(() => null)
  const title = hp?.metaTitle || 'Sammenlign betting bonusser — find de bedste tilbud i Danmark'
  const description = hp?.metaDescription || 'Danmarks uafhængige guide til betting bonusser. Vi sammenligner og anmelder alle store bookmakers.'
  return {
    title,
    description,
    alternates: { canonical: BASE },
    openGraph: { title, description, url: BASE, type: 'website' },
    twitter: { title, description },
  }
}

export default async function HomePage() {
  const [bookmakers, posts, hp] = await Promise.all([
    getBookmakers().catch(() => []),
    getPosts(6).catch(() => []),
    getHomepage().catch(() => null),
  ])

  const heroHeading = hp?.heroHeading || 'Find de bedste'
  const heroGreen   = hp?.heroGreenText || 'betting bonusser'
  const heroSubtext = hp?.intro || 'Vi sammenligner og anmelder alle store bookmakers i Danmark. Find den bedste velkomstbonus og kom godt i gang.'

  const faqs = (hp?.body ?? [])
    .filter((b: any) => b._type === 'faqBlock')
    .flatMap((b: any) => b.items ?? [])
    .filter((f: any) => f.question && f.answer)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        url: BASE,
        name: 'Oddsbonussen.dk',
        inLanguage: 'da-DK',
      },
      {
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: 'Oddsbonussen',
        url: BASE,
      },
      ...(faqs.length > 0 ? [{
        '@type': 'FAQPage',
        mainEntity: faqs.map((f: any) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }] : []),
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar />

      {/* Hero */}
      <section className="hero-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 className="hero-heading">
            {heroHeading}<br />
            <span style={{ color: '#16a34a' }}>{heroGreen}</span>
          </h1>
          <p className="hero-subtext">{heroSubtext}</p>
        </div>
      </section>

      {/* Bookmaker list */}
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: '#111827' }}>
            Bedste bookmakers lige nu
          </h2>
          <a href="/betting-sider" style={{ fontSize: '13.5px', color: '#16a34a', textDecoration: 'none', fontWeight: 500 }}>Se alle →</a>
        </div>
        {(bookmakers as any[]).length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
            <p>Ingen bookmakers endnu — tilføj dem i Sanity Studio.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(bookmakers as any[]).map((bm: any, i: number) => (
              <BookmakerCard key={bm._id} {...bm} rank={i + 1} />
            ))}
          </div>
        )}
      </div>

      {/* Body content from Sanity */}
      {hp?.body && (
        <div className="article-layout" style={{ paddingBottom: '0' }}>
          <div className="article-content">
            <PortableTextRenderer value={hp.body} posts={posts as any} />
          </div>
          <aside className="toc-sidebar">
            <TableOfContents body={hp.body} />
          </aside>
        </div>
      )}

      {/* Latest articles */}
      {(posts as any[]).length > 0 && (
        <section style={{ padding: '48px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#111827' }}>Seneste guides & artikler</h2>
              <a href="/blog" style={{ fontSize: '13.5px', color: '#16a34a', textDecoration: 'none', fontWeight: 500 }}>Se alle →</a>
            </div>
            <div className="blog-grid">
              {(posts as any[]).map((post: any) => <PostCard key={post._id} {...post} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}
