'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavChild { label: string; href: string }
interface NavItem  { label: string; href: string; isHighlighted?: boolean; children?: NavChild[] }

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Luk menu' : 'Åbn menu'}
        aria-expanded={open}
      >
        <span className={`burger-icon${open ? ' open' : ''}`}>
          <span /><span /><span />
        </span>
      </button>

      {/* Backdrop */}
      {open && <div className="mobile-menu-backdrop" onClick={() => setOpen(false)} />}

      {/* Drawer */}
      <nav className={`mobile-menu-drawer${open ? ' open' : ''}`} aria-hidden={!open}>
        {items.map((item) => (
          <div key={item.href + item.label} className="mobile-menu-group">
            <Link
              href={item.href}
              className={`mobile-menu-link${item.isHighlighted ? ' mobile-menu-link-cta' : ''}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
            {item.children?.map((child) => (
              <Link
                key={child.href + child.label}
                href={child.href}
                className="mobile-menu-sublink"
                onClick={() => setOpen(false)}
              >
                {child.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </>
  )
}
