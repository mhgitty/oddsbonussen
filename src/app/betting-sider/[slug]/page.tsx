import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { TableOfContents } from '@/components/TableOfContents'
import { JsonLd } from '@/components/JsonLd'
import { getBookmakerBySlug, getPosts } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'

export const revalidate = 3600

const BASE = 'https://oddsbonussen.dk'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const bm = await getBookmakerBySlug(slug).catch(() => null)
  if (!bm) return {}
  const title = bm.metaTitle || `${bm.name} anmeldelse — bonus & odds`
  const description = bm.metaDescription || bm.intro || `Læs vores anmeldelse af ${bm.name}. Se bonus, gennemspilskrav og vores vurdering.`
  return {
    title,
    description,
    alternates: { canonical: `${BASE}/betting-sider/${slug}` },
  }
}

function ScoreMeter({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#16a34a' }}>
        {score.toFixed(1)}
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>ud af 10</div>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[...Array(10)].map((_, i) => (
            <div key={i} style={{
              width: '14px', height: '6px', borderRadius: '3px',
              background: i < Math.round(score) ? '#16a34a' : '#e5e7eb',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function BookmakerPage({ params }: Props) {
  const { slug } = await params
  const [bm, latestPosts] = await Promise.all([
    getBookmakerBySlug(slug).catch(() => null),
    getPosts(6),
  ])
  if (!bm) notFound()

  const canonical = `${BASE}/betting-sider/${slug}`

  const faqs = (bm.body || [])
    .filter((b: any) => b._type === 'faqBlock')
    .flatMap((b: any) => b.items || [])
    .filter((f: any) => f.question && f.answer)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Hjem', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Betting sider', item: `${BASE}/betting-sider` },
          { '@type': 'ListItem', position: 3, name: bm.name, item: canonical },
        ],
      },
      {
        '@type': 'Review',
        itemReviewed: { '@type': 'Organization', name: bm.name, url: bm.url },
        reviewRating: bm.score != null ? { '@type': 'Rating', ratingValue: bm.score, bestRating: 10 } : undefined,
        author: { '@type': 'Organization', name: 'Oddsbonussen' },
        url: canonical,
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
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
            <a href="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Hjem</a>
            <span style={{ margin: '0 6px' }}>›</span>
            <a href="/betting-sider" style={{ color: '#9ca3af', textDecoration: 'none' }}>Betting sider</a>
            <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: '#6b7280' }}>{bm.name}</span>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Logo */}
            {bm.logo?.url && (
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', flexShrink: 0 }}>
                <Image src={bm.logo.url} alt={bm.logo.alt || bm.name} width={120} height={60} style={{ objectFit: 'contain', maxHeight: '60px', width: 'auto' }} />
              </div>
            )}

            {/* Title + score */}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                {bm.name} anmeldelse
              </h1>
              {bm.usp && <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '16px' }}>{bm.usp}</p>}
              {bm.score != null && <ScoreMeter score={bm.score} />}
            </div>

            {/* Quick bonus box */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px 24px', flexShrink: 0, minWidth: '220px' }}>
              {bm.indbetalingsbonus && (
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Indbetalingsbonus</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#166534' }}>{bm.indbetalingsbonus}</div>
                </div>
              )}
              {bm.freeSpinsBonus && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Free spins</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#166534' }}>{bm.freeSpinsBonus}</div>
                </div>
              )}
              {bm.url && (
                <a href={bm.url} target="_blank" rel="noopener noreferrer sponsored"
                  style={{ display: 'block', background: '#16a34a', color: '#fff', padding: '12px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                  Hent bonus →
                </a>
              )}
              {bm.terms && <p style={{ fontSize: '10.5px', color: '#9ca3af', marginTop: '8px', lineHeight: 1.4 }}>{bm.terms}</p>}
            </div>
          </div>

          {/* Stats row */}
          {(bm.minIndbetaling != null || bm.gennemspilskrav || bm.trustpilot != null || bm.lanceringsdato) && (
            <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
              {bm.minIndbetaling != null && (
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Min. indbetaling</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{bm.minIndbetaling} kr.</div>
                </div>
              )}
              {bm.gennemspilskrav && (
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Gennemspilskrav</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{bm.gennemspilskrav}</div>
                </div>
              )}
              {bm.trustpilot != null && (
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Trustpilot</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>⭐ {bm.trustpilot.toFixed(1)} / 5</div>
                </div>
              )}
              {bm.lanceringsdato && (
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Lanceret</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                    {new Date(bm.lanceringsdato).toLocaleDateString('da-DK', { year: 'numeric', month: 'long' })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body content */}
      <div className="article-layout">
        <article className="article-content">
          {bm.body && <PortableTextRenderer value={bm.body} posts={latestPosts as any} />}
        </article>
        {bm.body && (
          <aside className="toc-sidebar">
            <TableOfContents body={bm.body} />
          </aside>
        )}
      </div>

      <Footer />
    </>
  )
}
