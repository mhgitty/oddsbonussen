import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { BookmakerCard } from '@/components/BookmakerCard'
import { JsonLd } from '@/components/JsonLd'
import { getBookmakers } from '@/lib/sanity'
import type { Metadata } from 'next'

const BASE = 'https://oddsbonussen.dk'

export const metadata: Metadata = {
  title: 'Bedste betting sider i Danmark 2025',
  description: 'Sammenlign de bedste danske betting sider. Vi anmelder og rangerer alle store bookmakers baseret på bonus, odds og brugeroplevelse.',
  alternates: { canonical: `${BASE}/betting-sider` },
}

export const revalidate = 3600

export default async function BettingSiderPage() {
  const bookmakers = await getBookmakers().catch(() => [])

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Hjem', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Betting sider', item: `${BASE}/betting-sider` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumb} />
      <Navbar />

      <div style={{ background: 'var(--bg-hero)', borderBottom: '1px solid var(--border)', padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.03em' }}>
            Bedste betting sider
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
            Vi har testet og anmeldt {(bookmakers as any[]).length > 0 ? (bookmakers as any[]).length : 'alle store'} bookmakers. Rangeret efter bonus, odds og brugeroplevelse.
          </p>
        </div>
      </div>

      <div className="section">
        {(bookmakers as any[]).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-faint)' }}>
            <p>Ingen bookmakers endnu — tilføj dem i Sanity Studio.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {(bookmakers as any[]).map((bm: any, i: number) => (
              <BookmakerCard key={bm._id} {...bm} rank={i + 1} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}
