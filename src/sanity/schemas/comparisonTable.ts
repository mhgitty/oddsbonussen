import { defineField } from 'sanity'

/**
 * Two fields to drop into any page/homepage schema:
 *   showComparisonTable  — toggle per page
 *   comparisonTemplate   — which shared template to use
 *
 * Changing the template document propagates to every page that references it.
 */
export const comparisonTableFields = [
  defineField({
    name: 'showComparisonTable',
    title: 'Vis sammenligningsliste',
    type: 'boolean',
    initialValue: false,
    description: 'Vises over brødteksten',
  }),
  defineField({
    name: 'comparisonTemplate',
    title: '📊 Sammenligningsskabelon',
    type: 'reference',
    to: [{ type: 'comparisonTableTemplate' }],
    options: { disableNew: false },
    description: 'Vælg en skabelon. Ændringer i skabelonen slår igennem på alle sider der bruger den.',
    hidden: ({ document }: any) => !document?.showComparisonTable,
  }),
]
