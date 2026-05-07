import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-04-22',
  useCdn: true,
})

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getPosts(limit = 20, categorySlug?: string) {
  const filter = categorySlug
    ? `*[_type == "post" && defined(publishedAt) && category->slug.current == $categorySlug]`
    : `*[_type == "post" && defined(publishedAt)]`

  return client.fetch(
    `${filter} | order(publishedAt desc) [0...$limit] {
      _id, title, slug, excerpt, publishedAt, readingTime, featuredImage,
      category-> { name, slug, emoji }
    }`,
    { limit, categorySlug: categorySlug ?? '' }
  )
}

export async function getPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, excerpt, body, publishedAt, lastUpdated, readingTime,
      "featuredImage": featuredImage { "url": asset->url, alt },
      "ogImage": ogImage { "url": asset->url, alt },
      metaTitle, metaDescription,
      category-> { name, slug, emoji },
      author-> { name, bio, linkedin, "imageUrl": image.asset->url }
    }`,
    { slug }
  )
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0] {
      _id, title, slug, intro, body, metaTitle, metaDescription,
      "featuredImage": featuredImage { "url": asset->url, alt },
      "author": author-> {
        name, bio, linkedin, x, facebook,
        "imageUrl": image.asset->url
      },
      ${COMPARISON_TABLE_FRAGMENT}
    }`,
    { slug }
  )
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories() {
  return client.fetch(
    `*[_type == "category"] | order(name asc) { _id, name, slug, emoji, description }`
  )
}

// ─── Bookmakers ───────────────────────────────────────────────────────────────

export async function getBookmakers() {
  return client.fetch(
    `*[_type == "bookmaker"] | order(score desc) {
      _id, name, slug, usp, score, trustpilot,
      indbetalingsbonus, freeSpinsBonus, minIndbetaling,
      gennemspilskrav, url, terms,
      "logo": logo { "url": asset->url, alt }
    }`
  )
}

export async function getBookmakerBySlug(slug: string) {
  return client.fetch(
    `*[_type == "bookmaker" && slug.current == $slug][0] {
      _id, name, slug, usp, score, trustpilot,
      indbetalingsbonus, freeSpinsBonus, minIndbetaling, gennemspilskrav,
      url, terms, lanceringsdato, intro, body,
      "logo": logo { "url": asset->url, alt },
      "ogImage": ogImage { "url": asset->url, alt },
      metaTitle, metaDescription
    }`,
    { slug }
  )
}

// ─── Bonusser ─────────────────────────────────────────────────────────────────

export async function getBonuses(limit = 50) {
  return client.fetch(
    `*[_type == "bonus" && active == true] | order(oddsBonusPlacering asc, _createdAt desc) [0...$limit] {
      _id, title, slug,
      oddsBonusTitel, indbetalingsbonusTitel, velkomstbonusTitel,
      oddsBonusPlacering, minimumOdds, minimumIndbetaling, gennemspilskrav,
      offerUrl, terms, bonusType, casinoNavn,
      "casinoLogo":    casinoLogo    { "url": asset->url, alt },
      "kampagneBillede": kampagneBillede { "url": asset->url, alt },
      "bookmaker": bookmaker-> { name, slug }
    }`,
    { limit }
  )
}

// Keep old name as alias for any existing usage
export const getBonusser = getBonuses

export async function getBonusBySlug(slug: string) {
  return client.fetch(
    `*[_type == "bonus" && slug.current == $slug][0] {
      _id, title, slug, body, metaTitle, metaDescription,
      oddsBonusTitel, indbetalingsbonusTitel, velkomstbonusTitel,
      minimumOdds, minimumIndbetaling, gennemspilskrav,
      offerUrl, terms, bonusType, casinoNavn,
      "casinoLogo":      casinoLogo      { "url": asset->url, alt },
      "kampagneBillede": kampagneBillede { "url": asset->url, alt },
      "ogImage":         ogImage         { "url": asset->url, alt },
      "bookmaker": bookmaker-> { name, slug }
    }`,
    { slug }
  )
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

// ─── Comparison table fragment ─────────────────────────────────────────────────
// Pages store showComparisonTable (bool) + comparisonTemplate (reference).
// We expand the reference inline so the frontend gets the same data shape.
const COMPARISON_TABLE_FRAGMENT = `
  showComparisonTable, comparisonTableTitle,
  "comparisonTable": comparisonTemplate-> {
    tableType,
    bonuses[]-> {
      _id, title, slug, active,
      oddsBonusTitel, indbetalingsbonusTitel, velkomstbonusTitel,
      minimumOdds, minimumIndbetaling, gennemspilskrav,
      offerUrl, terms, casinoNavn,
      "casinoLogo":      casinoLogo      { "url": asset->url, alt },
      "kampagneBillede": kampagneBillede { "url": asset->url, alt },
      "bookmaker": bookmaker-> { name, slug }
    },
    bookmakers[]-> {
      _id, name, slug, usp, score, trustpilot,
      indbetalingsbonus, freeSpinsBonus, minIndbetaling, gennemspilskrav,
      url, terms,
      "logo": logo { "url": asset->url, alt }
    }
  }
`

export async function getHomepage() {
  return client.fetch(
    `*[_type == "homepage" && _id == "homepage"][0] {
      heroHeading, heroGreenText, intro, body,
      howItWorksTitle, showHowItWorks, howItWorksItems,
      metaTitle, metaDescription,
      "featuredImage": featuredImage { "url": asset->url, alt },
      ${COMPARISON_TABLE_FRAGMENT}
    }`
  )
}
