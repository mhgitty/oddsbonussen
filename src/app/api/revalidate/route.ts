import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const type = body?._type as string | undefined
    const slug = body?.slug?.current as string | undefined

    const revalidated: string[] = []
    const touch = (path: string, kind?: 'page' | 'layout') => {
      revalidatePath(path, kind)
      revalidated.push(path)
    }

    if (type === 'homepage') {
      touch('/', 'page')
    } else if (type === 'post') {
      touch('/blog/', 'page')
      touch('/', 'page')
      if (slug) touch(`/blog/${slug}/`, 'page')
      else touch('/blog/[slug]', 'page')
    } else if (type === 'page') {
      // Revalidate all dynamic pages — we don't know the parent path from slug alone
      touch('/', 'layout')
    } else if (type === 'bookmaker') {
      touch('/betting-sider/', 'page')
      touch('/', 'page')
      if (slug) touch(`/betting-sider/${slug}/`, 'page')
      else touch('/betting-sider/[slug]', 'page')
    } else if (type === 'bonus') {
      touch('/kampagner/', 'page')
      if (slug) touch(`/kampagner/${slug}/`, 'page')
      else touch('/kampagner/[slug]', 'page')
    } else if (type === 'siteSettings' || type === 'comparisonTableTemplate') {
      // These affect every page (navbar, footer, comparison tables)
      touch('/', 'layout')
    } else if (type === 'author') {
      touch('/', 'layout')
    } else if (type === 'category') {
      touch('/blog/', 'page')
    } else {
      touch('/', 'layout')
    }

    return NextResponse.json({ revalidated: true, type: type ?? 'unknown', paths: revalidated })
  } catch (err) {
    return NextResponse.json({ message: 'Revalidation failed', error: String(err) }, { status: 500 })
  }
}
