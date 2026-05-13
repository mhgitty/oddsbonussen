import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { AuthorBar } from '@/components/AuthorBar'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { MobileToc } from '@/components/MobileToc'
import { TableOfContents } from '@/components/TableOfContents'
import { JsonLd } from '@/components/JsonLd'
import { getLigaStillingerBySlug, getLigaStillingerPaths, getSiteSettings } from '@/lib/sanity'
import { replaceDateVars } from '@/lib/dateVars'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 3600

const BASE = 'https://oddsbonussen.dk'
const SM_BASE = 'https://api.sportmonks.com/v3/football'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const paths = await getLigaStillingerPaths()
  return paths.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getLigaStillingerBySlug(slug).catch(() => null)
  if (!page) return {}
  const title = replaceDateVars(page.metaTitle || page.title)
  const description = replaceDateVars(page.metaDescription || `Se ${page.leagueName} stillinger – opdateret live.`)
  const canonical = `${BASE}/liga-stillinger/${slug}/`
  return { title, description, alternates: { canonical } }
}

// ─── Sportsmonks helpers ──────────────────────────────────────────────────────

interface StandingRow {
  position: number
  teamName: string
  teamLogo: string | null
  played: number
  won: number
  draw: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
  form: string | null
}

async function fetchStandings(leagueId: number, seasonId?: number | null): Promise<StandingRow[]> {
  const token = process.env.SPORTSMONKS_API_TOKEN
  if (!token) return []

  try {
    let url: string

    if (seasonId) {
      url = `${SM_BASE}/standings/seasons/${seasonId}?api_token=${token}&include=participant`
    } else {
      // Get current season for the league first
      const leagueRes = await fetch(
        `${SM_BASE}/leagues/${leagueId}?api_token=${token}&include=currentSeason`,
        { next: { revalidate: 3600 } }
      )
      const leagueData = await leagueRes.json()
      const currentSeasonId = leagueData?.data?.currentSeason?.id
      if (!currentSeasonId) return []
      url = `${SM_BASE}/standings/seasons/${currentSeasonId}?api_token=${token}&include=participant`
    }

    const res = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()
    const rows = data?.data || []

    return rows
      .map((row: any) => {
        const d = row.details || {}
        return {
          position: row.position ?? 0,
          teamName: row.participant?.name ?? '—',
          teamLogo: row.participant?.image_path ?? null,
          played: d.values?.GP?.all ?? d.values?.['GP']?.all ?? 0,
          won: d.values?.W?.all ?? 0,
          draw: d.values?.D?.all ?? 0,
          lost: d.values?.L?.all ?? 0,
          goalsFor: d.values?.['Goals For']?.all ?? d.values?.GF?.all ?? 0,
          goalsAgainst: d.values?.['Goals Against']?.all ?? d.values?.GA?.all ?? 0,
          goalDiff: d.values?.['Goal Difference']?.all ?? 0,
          points: d.values?.PTS?.all ?? row.points ?? 0,
          form: row.form ?? null,
        }
      })
      .sort((a: StandingRow, b: StandingRow) => a.position - b.position)
  } catch {
    return []
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function LigaStillingerPage({ params }: Props) {
  const { slug } = await params
  const [page, settings] = await Promise.all([
    getLigaStillingerBySlug(slug).catch(() => null),
    getSiteSettings().catch(() => null),
  ])
  if (!page) notFound()

  const author = settings?.defaultAuthor ?? null
  const canonical = `${BASE}/liga-stillinger/${slug}/`
  const standings = await fetchStandings(page.leagueId, page.seasonId)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Hjem', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Liga stillinger', item: `${BASE}/liga-stillinger/` },
          { '@type': 'ListItem', position: 3, name: page.leagueName, item: canonical },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: replaceDateVars(page.title),
        inLanguage: 'da-DK',
        publisher: { '@type': 'Organization', name: 'Oddsbonussen', url: BASE },
      },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar />

      {/* Hero */}
      <section className="hero-section" style={{ background: 'var(--bg-hero)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <Breadcrumbs crumbs={[
            { label: 'Hjem', href: '/' },
            { label: 'Liga stillinger', href: '/liga-stillinger' },
            { label: page.leagueName },
          ]} />
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 3.5vw, 40px)',
            fontWeight: 800,
            color: 'var(--text)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: author ? '20px' : '0',
            width: '100%',
          }}>
            {replaceDateVars(page.title)}
          </h1>
          <AuthorBar author={author} updatedAt={page.lastUpdated ?? null} />
        </div>
      </section>

      {/* Standings table + optional TOC sidebar */}
      <div className="article-layout">
        <div style={{ minWidth: 0 }}>

          {/* Standings */}
          <div style={{ marginBottom: '48px' }}>
            <StandingsTable rows={standings} leagueName={page.leagueName} />
          </div>

          {/* Body text */}
          {page.body && (
            <>
              <MobileToc body={page.body} />
              <PortableTextRenderer value={page.body} />
            </>
          )}
        </div>

        {page.body && (
          <aside className="toc-sidebar">
            <TableOfContents body={page.body} />
          </aside>
        )}
      </div>

      <Footer />
    </>
  )
}

// ─── Standings table component ────────────────────────────────────────────────

function StandingsTable({ rows, leagueName }: { rows: StandingRow[]; leagueName: string }) {
  if (!rows.length) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        color: 'var(--text-faint)',
        fontSize: '14px',
      }}>
        Ingen stillingsdata tilgængelig for {leagueName} — tjek at SPORTSMONKS_API_TOKEN er sat i .env.local.
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Table header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ fontSize: '16px' }}>🏆</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--text)',
        }}>
          {leagueName} — Stilling
        </span>
      </div>

      {/* Scrollable table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-raised)' }}>
              <Th style={{ width: '36px', textAlign: 'center' }}>#</Th>
              <Th style={{ textAlign: 'left' }}>Hold</Th>
              <Th title="Spillede">K</Th>
              <Th title="Vundet">V</Th>
              <Th title="Uafgjort">U</Th>
              <Th title="Tabt">T</Th>
              <Th title="Mål for">MF</Th>
              <Th title="Mål imod">MI</Th>
              <Th title="Målforskel">MF±</Th>
              <Th title="Point" style={{ color: 'var(--green)', fontWeight: 700 }}>P</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: '1px solid var(--border-faint)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                }}
              >
                <td style={{ padding: '10px 8px', textAlign: 'center', color: 'var(--text-faint)', fontWeight: 600, fontSize: '12px' }}>
                  {row.position}
                </td>
                <td style={{ padding: '10px 12px 10px 8px', minWidth: '140px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {row.teamLogo
                      ? <img src={row.teamLogo} alt={row.teamName} width={20} height={20} style={{ objectFit: 'contain', flexShrink: 0 }} />
                      : <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }} />
                    }
                    <span style={{ fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' }}>{row.teamName}</span>
                  </div>
                </td>
                <Td>{row.played}</Td>
                <Td>{row.won}</Td>
                <Td>{row.draw}</Td>
                <Td>{row.lost}</Td>
                <Td>{row.goalsFor}</Td>
                <Td>{row.goalsAgainst}</Td>
                <Td style={{ color: row.goalDiff > 0 ? 'var(--green)' : row.goalDiff < 0 ? '#f87171' : 'var(--text-muted)' }}>
                  {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                </Td>
                <Td style={{ fontWeight: 700, color: 'var(--text)' }}>{row.points}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border-faint)', fontSize: '11px', color: 'var(--text-faint)' }}>
        Data fra Sportsmonks · Opdateres hvert 60 min
      </div>
    </div>
  )
}

function Th({ children, style, title }: { children?: React.ReactNode; style?: React.CSSProperties; title?: string }) {
  return (
    <th title={title} style={{
      padding: '10px 8px',
      textAlign: 'center',
      fontSize: '11px',
      fontWeight: 600,
      color: 'var(--text-faint)',
      textTransform: 'uppercase',
      letterSpacing: '0.4px',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </th>
  )
}

function Td({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td style={{
      padding: '10px 8px',
      textAlign: 'center',
      color: 'var(--text-muted)',
      ...style,
    }}>
      {children}
    </td>
  )
}
