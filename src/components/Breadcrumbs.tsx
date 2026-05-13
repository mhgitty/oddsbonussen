import Link from 'next/link'

interface Crumb {
  label: string
  href?: string
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Brødkrumme" style={{ fontSize: '13px', color: 'var(--text-faint)', marginBottom: '20px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '2px' }}>
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {i > 0 && <span style={{ margin: '0 4px', opacity: 0.5 }}>›</span>}
            {isLast || !crumb.href ? (
              <span style={{ color: isLast ? 'var(--text-muted)' : 'var(--text-faint)' }}>{crumb.label}</span>
            ) : (
              <Link href={crumb.href} style={{ color: 'var(--text-faint)', textDecoration: 'none' }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                onMouseOut={e => (e.currentTarget.style.color = 'var(--text-faint)')}
              >
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
