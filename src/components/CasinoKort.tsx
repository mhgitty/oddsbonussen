'use client'

import { useEffect, useState } from 'react'
import { createClient } from 'next-sanity'

interface CasinoData {
  title: string
  bonusText: string
  logoUrl: string | null
  logoAlt: string | null
  score: number | null
  offerUrl: string
  terms: string | null
  bookmakerName: string | null
}

interface Props {
  bonusSlug: string
}

export function CasinoKort({ bonusSlug }: Props) {
  const [data, setData] = useState<CasinoData | null>(null)

  useEffect(() => {
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: '2026-04-22',
      useCdn: true,
    })

    client.fetch<CasinoData | null>(
      `*[_type == "bonus" && slug.current == $slug][0] {
        "title": coalesce(bookmaker->name, casinoNavn, title),
        "bonusText": coalesce(velkomstbonusTitel, oddsBonusTitel, indbetalingsbonusTitel, title),
        "logoUrl": coalesce(casinoLogo.asset->url, bookmaker->logo.asset->url),
        "logoAlt": coalesce(casinoLogo.alt, bookmaker->logo.alt),
        "score": bookmaker->score,
        "offerUrl": offerUrl,
        "terms": terms,
        "bookmakerName": bookmaker->name,
      }`,
      { slug: bonusSlug }
    ).then(setData).catch(() => null)
  }, [bonusSlug])

  // Skeleton while loading
  if (!data) {
    return (
      <div style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px 24px',
        margin: '24px 0',
        height: '90px',
        opacity: 0.5,
      }} />
    )
  }

  const stars = data.score ? Math.round(data.score / 2) : null

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderLeft: '3px solid var(--green)',
      borderRadius: '12px',
      padding: '18px 20px',
      margin: '24px 0',
      display: 'grid',
      gridTemplateColumns: '80px 1fr auto',
      gap: '16px',
      alignItems: 'center',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        borderRadius: '8px',
        padding: '8px',
        height: '54px',
      }}>
        {data.logoUrl ? (
          <img
            src={data.logoUrl}
            alt={data.logoAlt || data.title}
            style={{ maxWidth: '68px', maxHeight: '36px', objectFit: 'contain' }}
          />
        ) : (
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>{data.title.slice(0, 8)}</span>
        )}
      </div>

      {/* Info */}
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '15px',
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: '4px',
        }}>
          {data.title}
        </div>
        <div style={{
          fontSize: '14px',
          color: 'var(--green)',
          fontWeight: 600,
          marginBottom: '4px',
        }}>
          {data.bonusText}
        </div>
        {stars !== null && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
            <span style={{ marginLeft: '4px' }}>{data.score?.toFixed(1)}/10</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'right', minWidth: '120px' }}>
        <a
          href={data.offerUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          style={{
            display: 'inline-block',
            background: 'var(--green-dark)',
            color: '#fff',
            padding: '9px 16px',
            borderRadius: '7px',
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Hent bonus →
        </a>
        {data.terms && (
          <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '5px', maxWidth: '130px' }}>
            {data.terms}
          </div>
        )}
      </div>
    </div>
  )
}
