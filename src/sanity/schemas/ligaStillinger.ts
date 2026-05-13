import { defineField, defineType } from 'sanity'
import { LeaguePicker } from '../components/LeaguePicker'
import { bodyField } from './page'

export const ligaStillingerType = defineType({
  name: 'ligaStillinger',
  title: 'Liga stillinger',
  type: 'document',
  icon: () => '🏆',
  fields: [
    defineField({
      name: 'title',
      title: 'H1 Titel',
      type: 'string',
      description: 'Sidens overskrift — vises som H1 på frontend. Brug [year] for indeværende år.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'leagueName',
      title: 'Liga navn (visningsnavn)',
      type: 'string',
      description: 'Fx "Premier League" — bruges til breadcrumbs og interne referencer.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'leagueId',
      title: 'Liga (Sportsmonks)',
      type: 'number',
      description: 'Søg og vælg den liga du vil vise stillinger for.',
      components: { input: LeaguePicker },
      validation: (R) => R.required().integer().positive(),
    }),
    defineField({
      name: 'seasonId',
      title: 'Sæson ID (valgfrit)',
      type: 'number',
      description: 'Udfyld kun hvis du vil vise en specifik sæson i stedet for den aktuelle.',
    }),
    defineField({
      ...bodyField,
      title: 'Brødtekst (under stillinger)',
      description: 'Vises under standings-tabellen på frontend.',
    }),
    // SEO
    defineField({
      name: 'metaTitle',
      title: 'Meta titel',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta beskrivelse',
      type: 'text',
      rows: 2,
      group: 'seo',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Sidst opdateret',
      type: 'date',
      group: 'seo',
    }),
  ],

  groups: [
    { name: 'seo', title: 'SEO', icon: () => '🔍' },
  ],

  preview: {
    select: { title: 'title', leagueName: 'leagueName' },
    prepare({ title, leagueName }: any) {
      return {
        title: title || 'Uden titel',
        subtitle: leagueName || '',
        media: () => '🏆',
      }
    },
  },
})
