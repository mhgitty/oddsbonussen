interface HeroSectionProps {
  title: string
  intro?: string
  eyebrow?: string        // small label above the title (e.g. category name)
  updatedAt?: string      // ISO date string
  narrow?: boolean        // 760px vs 1200px max-width
}

export function HeroSection({ title, intro, eyebrow, updatedAt, narrow = false }: HeroSectionProps) {
  const maxWidth = narrow ? '760px' : '1200px'

  const dateStr = updatedAt
    ? new Date(updatedAt).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <section style={{
      background: 'var(--bg-hero)',
      borderBottom: '1px solid var(--border)',
      padding: '48px 24px 40px',
    }}>
      <div style={{ maxWidth, margin: '0 auto' }}>
        {eyebrow && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(34,197,94,0.12)', color: 'var(--green)',
            fontSize: '12px', fontWeight: 600,
            padding: '4px 12px', borderRadius: '20px',
            marginBottom: '16px',
          }}>
            {eyebrow}
          </div>
        )}

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 4.5vw, 48px)',
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: intro ? '16px' : '0',
          maxWidth: '820px',
        }}>
          {title}
        </h1>

        {dateStr && (
          <div style={{ fontSize: '12.5px', color: 'var(--text-faint)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>📅</span> Sidst opdateret: {dateStr}
          </div>
        )}

        {intro && (
          <p style={{
            fontSize: '16px',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            maxWidth: '640px',
            margin: 0,
          }}>
            {intro}
          </p>
        )}
      </div>
    </section>
  )
}
