import Link from 'next/link'
import Image from 'next/image'
import { getSiteSettings } from '@/lib/sanity'

// Fallback nav used when no siteSettings document exists yet
const DEFAULT_NAV = [
  { label: 'Sammenlign',    url: '/',               isHighlighted: false, children: [] },
  { label: 'Betting sider', url: '/betting-sider/', isHighlighted: false, children: [] },
  { label: 'Bonusser',      url: '/bonusser/',       isHighlighted: false, children: [] },
  { label: 'Guides',        url: '/blog/',           isHighlighted: false, children: [] },
]

// Resolve the final href — page ref wins, then bookmaker ref, then manual url
function resolveUrl(item: {
  url?: string
  pageSlug?: string
  pageParentSlug?: string
  bookmakerSlug?: string
}): string {
  if (item.pageSlug) {
    return item.pageParentSlug
      ? `/${item.pageParentSlug}/${item.pageSlug}/`
      : `/${item.pageSlug}/`
  }
  if (item.bookmakerSlug) return `/betting-sider/${item.bookmakerSlug}/`
  return item.url || '/'
}

export async function Navbar() {
  const settings = await getSiteSettings().catch(() => null)
  const nav: any[] = settings?.headerNav?.length ? settings.headerNav : DEFAULT_NAV

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <Image
            src="/logo.webp"
            alt="Oddsbonussen"
            height={36}
            width={200}
            style={{ height: '36px', width: 'auto', display: 'block' }}
            priority
          />
        </Link>

        <nav className="navbar-nav">
          {nav.map((item: any) => {
            const href = resolveUrl(item)
            const hasChildren = item.children?.length > 0

            if (!hasChildren) {
              return (
                <Link
                  key={href + item.label}
                  href={href}
                  className={`nav-link${item.isHighlighted ? ' nav-link-cta' : ''}`}
                >
                  {item.label}
                </Link>
              )
            }

            return (
              <div key={href + item.label} className="nav-item-dropdown">
                <Link
                  href={href}
                  className={`nav-link nav-link-has-children${item.isHighlighted ? ' nav-link-cta' : ''}`}
                >
                  {item.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: '4px', flexShrink: 0 }}>
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <div className="nav-dropdown">
                  {item.children.map((child: any) => {
                    const childHref = resolveUrl(child)
                    return (
                      <Link key={childHref + child.label} href={childHref} className="nav-dropdown-item">
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
