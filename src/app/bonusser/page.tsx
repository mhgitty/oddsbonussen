import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { getBonusser } from '@/lib/sanity'
import Link from 'next/link'
import type { Metadata } from 'next'

const BASE = 'https://oddsbonussen.dk'

export const metadata: Metadata = {
  title: 'Betting bonusser i Danmark 2025',
  description: 'Oversigt over de bedste betting bonusser i Danmark. Find velkomstbonusser, free spins og eksklusive tilbud.',
  alternates: { canonical: `${BASE}/bonusser` },
}

export const revalidate = 3600

export default async function BonusserPage() {
  const bonusser = await getBonusser(40).catch(() => [])

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Hjem', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Bonusser', item: `${BASE}/bonusser` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumb} />
      <Navbar />

      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '-0.03em' }}>
            Betting bonusser
          </h1>
          <p style={{ fontSize: '15px', color: '#6b7280' }}>Oversigt over de bedste aktuelle bonusser fra danske bookmakers.</p>
        </div>
      </div>

      <div className="section">
        {(bonusser as any[]).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#9ca3af' }}>
            <p>Ingen bonusser endnu — tilføj dem i Sanity Studio.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {(bonusser as any[]).map((bonus: any) => (
              <Link key={bonus._id} href={`/bonusser/${bonus.slug.current}`} style={{ textDecoration: 'none' }}>
                <article style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', height: '100%' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '10px', lineHeight: 1.35 }}>
                    🎁 {bonus.title}
                  </h3>
                  {bonus.intro && (
                    <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.65 }}>{bonus.intro}</p>
                  )}
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}
