interface CasinoKortData {
  customTitle?: string
  customBody?: string
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

export function CasinoKort({ value }: { value: CasinoKortData }) {
  const bm = value.bookmaker
  const bonus = value.bonus

  // Resolve display values — prefer bookmaker, fall back to bonus
  const name = value.customTitle || bm?.name || bonus?.name || ''
  const logoUrl = bm?.logoUrl || bonus?.logoUrl || null
  const logoAlt = bm?.logoAlt || bonus?.logoAlt || name
  const score = bm?.score ?? bonus?.score ?? null
  const offerUrl = bm?.url || bonus?.url || bonus?.offerUrl || ''
  const terms = bm?.terms || bonus?.terms || null
  const bonusText = bonus?.bonusText || null

  if (!name && !logoUrl) return null

  const stars = score ? Math.round(score / 2) : null

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderLeft: '3px solid var(--green)',
      borderRadius: '12px',
      padding: '20px',
      margin: '24px 0',
    }}>
      {/* Top row: logo + name + bonus + score + CTA */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* Logo */}
        {logoUrl && (
          <div style={{
            flexShrink: 0,
            width: '64px',
            height: '64px',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <img
              src={logoUrl}
              alt={logoAlt}
              style={{ width: '64px', height: '64px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '3px',
          }}>
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

        {/* CTA */}
        {offerUrl && (
          <div style={{ flexShrink: 0 }}>
            <a
              href={offerUrl}
              target="_blank"
              rel="nofollow noopener noreferrer sponsored"
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
          </div>
        )}
      </div>

      {/* Body text */}
      {value.customBody && (
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '14px 0 0', lineHeight: 1.6 }}>
          {value.customBody}
        </p>
      )}

      {/* Pros & Cons */}
      {((value.pros?.length ?? 0) > 0 || (value.cons?.length ?? 0) > 0) && (
        <div style={{ display: 'flex', gap: '16px', marginTop: '14px', flexWrap: 'wrap' }}>
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

      {/* Terms */}
      {terms && (
        <p style={{ fontSize: '10px', color: 'var(--text-faint)', margin: '10px 0 0', lineHeight: 1.5 }}>
          {terms}
        </p>
      )}
    </div>
  )
}
