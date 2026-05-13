import Link from 'next/link'

interface Crumb {
  label: string
  href?: string
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Brødkrumme" style={{ fontSize: '13px', color: 'var(--text-faint)', marginBottom: '20px', display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px' }}>
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'baseline', gap: '2px', minWidth: 0 }}>
            {i > 0 && <span style={{ margin: '0 4px', opacity: 0.5, flexShrink: 0 }}>›</span>}
            {isLast || !crumb.href ? (
              <span style={{ color: isLast ? 'var(--text-muted)' : 'var(--text-faint)', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="breadcrumb-link" style={{ whiteSpace: 'nowrap' }}>
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
