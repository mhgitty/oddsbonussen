import type { DocumentActionComponent, DocumentActionProps } from 'sanity'

const BASE = 'https://oddsbonussen.dk'

function resolveUrl(type: string, doc: Record<string, any>): string | null {
  const slug = doc?.slug?.current as string | undefined

  switch (type) {
    case 'homepage':
      return `${BASE}/`
    case 'post':
      return slug ? `${BASE}/blog/${slug}/` : `${BASE}/blog/`
    case 'page': {
      if (!slug) return null
      const parentSlug = doc?.parent?.slug?.current as string | undefined
      return parentSlug
        ? `${BASE}/${parentSlug}/${slug}/`
        : `${BASE}/${slug}/`
    }
    case 'bookmaker':
      return slug ? `${BASE}/betting-sider/${slug}/` : `${BASE}/betting-sider/`
    case 'bonus':
      return slug ? `${BASE}/kampagner/${slug}/` : `${BASE}/kampagner/`
    default:
      return null
  }
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
}

export const previewAction: DocumentActionComponent = (
  props: DocumentActionProps
) => {
  const url = resolveUrl(props.type, props.draft ?? props.published ?? {})
  if (!url) return null

  return {
    label: 'Se på sitet',
    icon: ExternalLinkIcon,
    onHandle: () => {
      window.open(url, '_blank', 'noopener,noreferrer')
    },
  }
}
