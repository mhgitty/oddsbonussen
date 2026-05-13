import { PortableText } from '@portabletext/react'

interface CasinoKortData {
  customTitle?: string
  customBody?: any[]
  imageUrl?: string | null
  pros?: string[]
  cons?: string[]
  bonus?: {
    name: string
    bonusText: string
    logoUrl: string | null
    logoAlt: string | null
    score: number | null
    offerUrl: string
    terms: string | null
    url: string
  }
  bookmaker?: {
    name: string
    score: number | null
    logoUrl: string | null
    logoAlt: string | null
    url: string
    terms: string | null
  }
}

const bodyComponents = {
  block: {
    normal: ({ children }: any) => (
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: 1.65 }}>{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul style={{ paddingLeft: '18px', margin: '0 0 8px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65 }}>{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol style={{ paddingLeft: '18px', margin: '0 0 8px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65 }}>{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
  },
}

export function CasinoKort({ value }: { value: CasinoKortData }) {
  const bm = value.bookmaker
  const bonus = value.bonus

  const name = value.customTitle || bm?.name || bonus?.name || ''
  const logoUrl = bm?.logoUrl || bonus?.logoUrl || null
  const logoAlt = bm?.logoAlt || bonus?.logoAlt || name
  const score = bm?.score ?? bonus?.score ?? null
  const terms = bm?.terms || bonus?.terms || null
  const bonusText = bonus?.bonusText || null

  // CTA: bonus takes priority, then bookmaker
  const ctaUrl = bonus?.url || bonus?.offerUrl || bm?.url || ''
  const ctaLabel = bonus ? 'Få bonus nu' : bm ? 'Besøg bookmaker' : null

  if (!name && !logoUrl) return null

  const stars = score ? Math.round(score / 2) : null

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      overflow: 'hidden',
      margin: '24px 0',
    }}>
      {/* Banner image */}
      {value.imageUrl && (
        <img
          src={value.imageUrl}
          alt={name}
          style={{ width: '100%', display: 'block', maxHeight: '280px', objectFit: 'cover' }}
        />
      )}

      {/* Content */}
      <div style={{ padding: '20px' }}>

        {/* Top row: logo + name + bonus text + score */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '14px' }}>
          {logoUrl && (
            <div style={{ flexShrink: 0, width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={logoUrl} alt={logoAlt} style={{ width: '64px', height: '64px', objectFit: 'cover', display: 'block' }} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '3px' }}>
              {name}
            </div>
            {bonusText && (
              <div style={{ fontSize: '14px', color: 'var(--green)', fontWeight: 600, marginBottom: '4px' }}>
                {bonusText}
              </div>
            )}
            {stars !== null && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                <span style={{ marginLeft: '4px' }}>{score?.toFixed(1)}/10</span>
              </div>
            )}
          </div>
        </div>

        {/* Rich text body */}
        {value.customBody && value.customBody.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <PortableText value={value.customBody} components={bodyComponents} />
          </div>
        )}

        {/* Pros & Cons */}
        {((value.pros?.length ?? 0) > 0 || (value.cons?.length ?? 0) > 0) && (
          <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
            {(value.pros?.length ?? 0) > 0 && (
              <div style={{ flex: 1, minWidth: '140px' }}>
                {value.pros!.map((pro, i) => (
                  <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--green)', flexShrink: 0, marginTop: '1px' }}>✓</span>
                    <span>{pro}</span>
                  </div>
                ))}
              </div>
            )}
            {(value.cons?.length ?? 0) > 0 && (
              <div style={{ flex: 1, minWidth: '140px' }}>
                {value.cons!.map((con, i) => (
                  <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }}>✗</span>
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        {ctaUrl && ctaLabel && (
          <a
            href={ctaUrl}
            target="_blank"
            rel="nofollow noopener noreferrer sponsored"
            style={{
              display: 'block',
              background: 'var(--green-dark)',
              color: '#fff',
              padding: '13px 24px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              textAlign: 'center',
              marginBottom: terms ? '10px' : '0',
            }}
          >
            {ctaLabel} →
          </a>
        )}

        {/* Terms */}
        {terms && (
          <p style={{ fontSize: '10px', color: 'var(--text-faint)', margin: 0, lineHeight: 1.5 }}>
            {terms}
          </p>
        )}

      </div>
    </div>
  )
}
