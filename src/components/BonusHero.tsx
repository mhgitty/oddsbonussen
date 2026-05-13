'use client'
import { useState } from 'react'

interface BonusHeroProps {
  title: string
  casinoNavn?: string | null
  logoUrl?: string | null
  logoAlt?: string | null
  offerUrl?: string | null
  terms?: string | null
  minimumOdds?: string | null
  minimumIndbetaling?: number | null
  gennemspilskrav?: string | null
  maksGevinst?: string | null
  bonuskode?: string | null
  spinVaerdi?: string | null
}

const stats: { key: keyof BonusHeroProps; label: string; icon: string; format?: (v: any) => string }[] = [
  { key: 'minimumOdds',       label: 'Min. odds',        icon: '📊' },
  { key: 'minimumIndbetaling',label: 'Min. indbetaling', icon: '💳', format: (v) => `${v} kr.` },
  { key: 'gennemspilskrav',   label: 'Gennemspilskrav',  icon: '🔄' },
  { key: 'maksGevinst',       label: 'Maks gevinst',     icon: '🏆' },
  { key: 'spinVaerdi',        label: 'Spinværdi',        icon: '🎰' },
]

export function BonusHero({
  title, casinoNavn, logoUrl, logoAlt, offerUrl, terms,
  minimumOdds, minimumIndbetaling, gennemspilskrav,
  maksGevinst, bonuskode, spinVaerdi,
}: BonusHeroProps) {
  const [copied, setCopied] = useState(false)

  const values: Record<string, any> = {
    minimumOdds, minimumIndbetaling, gennemspilskrav, maksGevinst, spinVaerdi,
  }

  const visibleStats = stats.filter(s => values[s.key] != null && values[s.key] !== '')

  function copyCode() {
    if (!bonuskode) return
    navigator.clipboard.writeText(bonuskode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section style={{
      background: 'var(--bg-hero)',
      borderBottom: '1px solid var(--border)',
      padding: '48px 24px 40px',
    }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

        {/* Logo + title row */}
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '28px' }}>
          {logoUrl && (
            <div style={{ flexShrink: 0, width: '72px', height: '72px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img src={logoUrl} alt={logoAlt || casinoNavn || title} style={{ width: '72px', height: '72px', objectFit: 'cover', display: 'block' }} />
            </div>
          )}
          <div>
            {casinoNavn && (
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                {casinoNavn}
              </div>
            )}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 3.5vw, 38px)',
              fontWeight: 800,
              color: 'var(--text)',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              margin: 0,
            }}>
              {title}
            </h1>
          </div>
        </div>

        {/* Stat chips */}
        {visibleStats.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
            {visibleStats.map(s => {
              const raw = values[s.key]
              const display = s.format ? s.format(raw) : String(raw)
              return (
                <div key={s.key} style={{
                  display: 'flex', flexDirection: 'column',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '10px 16px',
                  minWidth: '110px',
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontWeight: 500, marginBottom: '3px' }}>
                    {s.icon} {s.label}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
                    {display}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Bonuskode */}
        {bonuskode && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            background: 'rgba(34,197,94,0.08)',
            border: '1px dashed rgba(34,197,94,0.5)',
            borderRadius: '10px', padding: '10px 16px',
            marginBottom: '24px',
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                🎫 Bonuskode
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', letterSpacing: '0.08em' }}>
                {bonuskode}
              </div>
            </div>
            <button
              onClick={copyCode}
              style={{
                background: copied ? 'var(--green-dark)' : 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '6px', padding: '6px 12px',
                fontSize: '12px', fontWeight: 600,
                color: copied ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all .15s', flexShrink: 0,
              }}
            >
              {copied ? '✓ Kopieret' : 'Kopiér'}
            </button>
          </div>
        )}

        {/* CTA + terms */}
        {offerUrl && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
            <a
              href={offerUrl}
              target="_blank"
              rel="nofollow noopener noreferrer sponsored"
              style={{
                display: 'block',
                background: 'var(--green-dark)',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 700,
                textDecoration: 'none',
                textAlign: 'center',
                letterSpacing: '-0.01em',
              }}
            >
              Hent bonus nu →
            </a>
            {terms && (
              <p style={{ fontSize: '10px', color: 'var(--text-faint)', margin: 0, lineHeight: 1.5 }}>
                {terms}
              </p>
            )}
          </div>
        )}

      </div>
    </section>
  )
}
