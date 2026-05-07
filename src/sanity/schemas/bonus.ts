import { defineField, defineType } from 'sanity'
import { bodyField } from './page'

export const bonusType = defineType({
  name: 'bonus',
  title: 'Bonusser',
  type: 'document',
  groups: [
    { name: 'info',    title: '🎁 Bonus info' },
    { name: 'details', title: '📋 Detaljer' },
    { name: 'content', title: '📝 Indhold' },
    { name: 'seo',     title: '🔍 SEO' },
  ],
  fields: [
    // ── Identity ─────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      group: 'info',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'info',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),

    // ── Active ────────────────────────────────────────────────────────────────
    defineField({
      name: 'active',
      title: 'Aktiv',
      type: 'boolean',
      group: 'info',
      description: 'Kun aktive bonusser vises i sammenligningslister',
      initialValue: false,
    }),

    // ── Bookmaker relation ────────────────────────────────────────────────────
    defineField({
      name: 'bookmaker',
      title: 'Bookmaker',
      type: 'reference',
      group: 'info',
      to: [{ type: 'bookmaker' }],
      description: 'Hvilken bookmaker hører denne bonus til?',
    }),

    // ── Core bonus fields ─────────────────────────────────────────────────────
    defineField({
      name: 'casinoNavn',
      title: 'Casino navn',
      type: 'string',
      group: 'info',
    }),
    defineField({
      name: 'casinoLogo',
      title: 'Casino logo',
      type: 'image',
      group: 'info',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt-tekst', type: 'string' })],
    }),
    defineField({
      name: 'offerUrl',
      title: 'Offer URL',
      type: 'url',
      group: 'info',
      description: 'Affiliate link til bonustilbuddet',
    }),
    defineField({
      name: 'bonusType',
      title: 'Bonus type',
      type: 'string',
      group: 'info',
      options: {
        list: [
          { title: 'Velkomstbonus', value: 'velkomstbonus' },
          { title: 'Indbetalingsbonus', value: 'indbetalingsbonus' },
          { title: 'Odds bonus', value: 'odds_bonus' },
          { title: 'Free spins', value: 'free_spins' },
          { title: 'Casino bonus', value: 'casino_bonus' },
          { title: 'Bonus uden indbetaling', value: 'bonus_uden_indbetaling' },
          { title: 'Bonus uden omsætningskrav', value: 'bonus_uden_omsaetningskrav' },
          { title: 'Cashback', value: 'cashback' },
          { title: 'Kampagne', value: 'kampagne' },
        ],
      },
    }),

    // ── Odds bonus ────────────────────────────────────────────────────────────
    defineField({
      name: 'oddsBonusTitel',
      title: 'Odds bonus titel',
      type: 'string',
      group: 'info',
    }),
    defineField({
      name: 'oddsBonusPlacering',
      title: 'Odds bonus placering',
      type: 'number',
      group: 'info',
      description: 'Sorteringsrækkefølge på siden',
    }),
    defineField({
      name: 'minimumOdds',
      title: 'Minimum odds',
      type: 'string',
      group: 'info',
      description: 'F.eks. "1.70"',
    }),

    // ── Indbetalingsbonus ─────────────────────────────────────────────────────
    defineField({
      name: 'indbetalingsbonusTitel',
      title: 'Indbetalingsbonus titel',
      type: 'string',
      group: 'info',
    }),
    defineField({
      name: 'indbetalingsbonusBeskrivelse',
      title: 'Indbetalingsbonus beskrivelse',
      type: 'text',
      rows: 2,
      group: 'info',
    }),

    // ── Velkomstbonus ─────────────────────────────────────────────────────────
    defineField({
      name: 'velkomstbonusTitel',
      title: 'Velkomstbonus titel',
      type: 'string',
      group: 'info',
    }),
    defineField({
      name: 'velkomstbonusBeskrivelse',
      title: 'Velkomstbonus beskrivelse',
      type: 'text',
      rows: 2,
      group: 'info',
    }),

    // ── Bonus details ─────────────────────────────────────────────────────────
    defineField({
      name: 'minimumIndbetaling',
      title: 'Minimum indbetaling (kr.)',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'gennemspilskrav',
      title: 'Gennemspilskrav',
      type: 'string',
      group: 'details',
      description: 'F.eks. "x10" eller "Ingen"',
    }),
    defineField({
      name: 'spinVaerdi',
      title: 'Spin værdi',
      type: 'string',
      group: 'details',
      description: 'F.eks. "1 kr. pr. spin"',
    }),
    defineField({
      name: 'maksGevinst',
      title: 'Maks gevinst',
      type: 'string',
      group: 'details',
      description: 'F.eks. "500 kr." eller "Ubegrænset"',
    }),
    defineField({
      name: 'terms',
      title: 'Vilkår og betingelser',
      type: 'text',
      rows: 3,
      group: 'details',
    }),
    defineField({
      name: 'bonuskode',
      title: 'Bonuskode',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'bonuskodePromoTekst',
      title: 'Bonuskode promo tekst',
      type: 'string',
      group: 'details',
    }),

    // ── Free spins ────────────────────────────────────────────────────────────
    defineField({
      name: 'freeSpinsTitel',
      title: 'Free spins titel',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'freeSpinsUdenIndbetalingTitel',
      title: 'Free spins uden indbetaling titel',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'freeSpinsUdenIndbetalingBeskrivelse',
      title: 'Free spins uden indbetaling beskrivelse',
      type: 'text',
      rows: 2,
      group: 'details',
    }),

    // ── Campaign ──────────────────────────────────────────────────────────────
    defineField({
      name: 'kampagneBillede',
      title: 'Kampagne billede',
      type: 'image',
      group: 'details',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt-tekst', type: 'string' })],
    }),
    defineField({
      name: 'kampagneStart',
      title: 'Kampagne start',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'kampagneSlut',
      title: 'Kampagne slut',
      type: 'datetime',
      group: 'details',
    }),

    // ── Page content ──────────────────────────────────────────────────────────
    { ...bodyField, group: 'content' } as any,

    // ── SEO ───────────────────────────────────────────────────────────────────
    defineField({ name: 'metaTitle',       title: 'Meta titel',      type: 'string',                    group: 'seo' }),
    defineField({ name: 'metaDescription', title: 'Meta beskrivelse', type: 'text', rows: 3,            group: 'seo' }),
    defineField({
      name: 'ogImage',
      title: 'OG-billede',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt-tekst', type: 'string' })],
    }),
  ],
  preview: {
    select: {
      title:    'title',
      subtitle: 'casinoNavn',
      media:    'casinoLogo',
    },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle || '', media }
    },
  },
})
