import { NextResponse } from 'next/server'

const BASE = 'https://api.sportmonks.com/v3/football'

export async function GET() {
  const token = process.env.SPORTSMONKS_API_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'SPORTSMONKS_API_TOKEN not set' }, { status: 500 })
  }

  try {
    // Fetch all leagues (paginate up to 3 pages to cover ~225 leagues)
    const pages = await Promise.all(
      [1, 2, 3].map((page) =>
        fetch(`${BASE}/leagues?api_token=${token}&page=${page}&per_page=75`, {
          next: { revalidate: 86400 }, // cache for 24h
        }).then((r) => r.json())
      )
    )

    const leagues = pages
      .flatMap((p) => p.data || [])
      .map((l: any) => ({ id: l.id, name: l.name, country: l.country_id }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name))

    return NextResponse.json(leagues)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch leagues' }, { status: 502 })
  }
}
