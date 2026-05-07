import { defineField, defineType } from 'sanity'

const navItemFields = [
  defineField({ name: 'label', title: 'Tekst', type: 'string', validation: (r) => r.required() }),
  defineField({ name: 'url',   title: 'URL',   type: 'string', description: 'F.eks. /betting-sider eller https://...', validation: (r) => r.required() }),
  defineField({ name: 'isHighlighted', title: 'Fremhævet (CTA-knap)', type: 'boolean', initialValue: false }),
]

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: '⚙️ Siteindstillinger',
  type: 'document',
  groups: [
    { name: 'header', title: '🔝 Header' },
    { name: 'footer', title: '🔻 Footer' },
  ],
  fields: [
    // ── Header ────────────────────────────────────────────────────────────────
    defineField({
      name: 'headerNav',
      title: 'Header navigation',
      type: 'array',
      group: 'header',
      description: 'Elementer der vises i den øverste navigationsmenu. Træk for at ændre rækkefølge.',
      of: [{
        type: 'object',
        name: 'navItem',
        fields: navItemFields,
        preview: {
          select: { title: 'label', subtitle: 'url', isHighlighted: 'isHighlighted' },
          prepare({ title, subtitle, isHighlighted }: any) {
            return { title: `${isHighlighted ? '⚡ ' : ''}${title}`, subtitle }
          },
        },
      }],
    }),

    // ── Footer ────────────────────────────────────────────────────────────────
    defineField({
      name: 'footerTagline',
      title: 'Footer tagline',
      type: 'text',
      rows: 2,
      group: 'footer',
      description: 'Kort tekst under logoet i footeren',
      initialValue: 'Danmarks uafhængige guide til betting bonusser og bookmakers. Vi sammenligner de bedste tilbud.',
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer kolonner',
      type: 'array',
      group: 'footer',
      description: 'Op til 2 kolonner med links. Træk for at ændre rækkefølge.',
      validation: (r) => r.max(2),
      of: [{
        type: 'object',
        name: 'footerColumn',
        fields: [
          defineField({ name: 'title', title: 'Kolonnetitel', type: 'string', validation: (r) => r.required() }),
          defineField({
            name: 'items',
            title: 'Links',
            type: 'array',
            of: [{
              type: 'object',
              name: 'navItem',
              fields: navItemFields,
              preview: {
                select: { title: 'label', subtitle: 'url' },
              },
            }],
          }),
        ],
        preview: {
          select: { title: 'title', items: 'items' },
          prepare({ title, items }: any) {
            return { title, subtitle: `${(items || []).length} links` }
          },
        },
      }],
    }),
    defineField({
      name: 'footerNote',
      title: 'Footer bundtekst (venstre)',
      type: 'string',
      group: 'footer',
      initialValue: '© 2025 Oddsbonussen.dk · Spil ansvarligt · 18+',
    }),
    defineField({
      name: 'footerDisclaimer',
      title: 'Footer bundtekst (højre)',
      type: 'string',
      group: 'footer',
      initialValue: 'Affiliatelinks kan forekomme · Se vilkår hos bookmaker',
    }),
  ],
  preview: {
    prepare() { return { title: 'Siteindstillinger' } },
  },
})
