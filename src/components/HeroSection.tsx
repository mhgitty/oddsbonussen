import { replaceDateVars } from '@/lib/dateVars'

interface Author {
  name: string
  linkedin?: string | null
  imageUrl?: string | null
}

interface HeroSectionProps {
  title: string
  intro?: string
  eyebrow?: string
  updatedAt?: string | null
  narrow?: boolean
  author?: Author | null
  factChecker?: Author | null
}

export function HeroSection({ title, intro, eyebrow, updatedAt, narrow = false, author, factChecker }: HeroSectionProps) {
  const maxWidth = narrow ? '760px' : '1080px'

  const dateStr = updatedAt
    ? new Date(updatedAt).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const hasAuthorBar = author || factChecker || dateStr

  return (
    <section style={{
      background: 'var(--bg-hero)',
      borderBottom: '1px solid var(--border)',
      padding: '44px 24px 36px',
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
          fontSize: 'clamp(24px, 3.5vw, 40px)',
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: hasAuthorBar ? '20px' : intro ? '16px' : '0',
          width: '100%',
        }}>
          {replaceDateVars(title)}
        </h1>

        {/* Author / fact-checker bar */}
        {hasAuthorBar && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            marginBottom: intro ? '20px' : '0',
            flexWrap: 'wrap',
          }}>
            {/* Author */}
            {author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {author.imageUrl && (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--border)' }}>
                    <img src={author.imageUrl} alt={author.name} style={{ width: '40px', height: '40px', objectFit: 'cover', display: 'block' }} />
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-faint)', lineHeight: 1.3 }}>
                    Forfatter:{' '}
                    {author.linkedin
                      ? <a href={author.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>{author.name}</a>
                      : <span style={{ color: 'var(--text)', fontWeight: 600 }}>{author.name}</span>
                    }
                  </div>
                  {dateStr && (
                    <div style={{ fontSize: '12px', color: 'var(--text-faint)', lineHeight: 1.3 }}>
                      Sidst opdateret: <span style={{ color: 'var(--text-muted)' }}>{dateStr}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Divider */}
            {author && factChecker && (
              <div style={{ width: '1px', height: '36px', background: 'var(--border)', flexShrink: 0 }} />
            )}

            {/* Fact checker */}
            {factChecker && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {factChecker.imageUrl && (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--border)' }}>
                    <img src={factChecker.imageUrl} alt={factChecker.name} style={{ width: '40px', height: '40px', objectFit: 'cover', display: 'block' }} />
                  </div>
                )}
                <div style={{ fontSize: '12px', color: 'var(--text-faint)', lineHeight: 1.3 }}>
                  Faktatjekker:{' '}
                  {factChecker.linkedin
                    ? <a href={factChecker.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>{factChecker.name}</a>
                    : <span style={{ color: 'var(--text)', fontWeight: 600 }}>{factChecker.name}</span>
                  }
                </div>
              </div>
            )}

            {/* Date only (no author) */}
            {!author && dateStr && (
              <div style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
                Sidst opdateret: <span style={{ color: 'var(--text-muted)' }}>{dateStr}</span>
              </div>
            )}
          </div>
        )}

        {intro && (
          <p style={{
            fontSize: '15px',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            width: '100%',
            margin: 0,
          }}>
            {replaceDateVars(intro)}
          </p>
        )}

      </div>
    </section>
  )
}
