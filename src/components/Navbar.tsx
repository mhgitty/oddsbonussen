import Link from 'next/link'
import Image from 'next/image'
import { getSiteSettings } from '@/lib/sanity'

// Fallback nav used when no siteSettings document exists yet
const DEFAULT_NAV = [
  { label: 'Sammenlign',    url: '/',             isHighlighted: false },
  { label: 'Betting sider', url: '/betting-sider', isHighlighted: false },
  { label: 'Bonusser',      url: '/bonusser',      isHighlighted: false },
  { label: 'Guides',        url: '/blog',           isHighlighted: false },
]

export async function Navbar() {
  const settings = await getSiteSettings().catch(() => null)
  const nav = settings?.headerNav?.length ? settings.headerNav : DEFAULT_NAV

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
          {nav.map((item: any) => (
            <Link
              key={item.url}
              href={item.url}
              className={`nav-link${item.isHighlighted ? ' nav-link-cta' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
