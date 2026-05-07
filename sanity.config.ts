import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'
import { WideStudioLayout } from './src/sanity/StudioLayout'

export default defineConfig({
  name: 'default',
  title: 'Oddsbonussen.dk',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Indhold')
          .items([
            // Singleton: Homepage
            S.listItem()
              .title('🏠 Forside')
              .id('homepage')
              .child(
                S.document()
                  .schemaType('homepage')
                  .documentId('homepage')
              ),
            S.divider(),
            S.listItem()
              .title('🎰 Bookmakers')
              .schemaType('bookmaker')
              .child(S.documentTypeList('bookmaker').title('Alle bookmakers')),
            S.listItem()
              .title('🎁 Bonusser')
              .schemaType('bonus')
              .child(S.documentTypeList('bonus').title('Alle bonusser')),
            S.divider(),
            S.listItem()
              .title('📝 Indlæg')
              .schemaType('post')
              .child(S.documentTypeList('post').title('Alle indlæg')),
            S.listItem()
              .title('📄 Sider')
              .schemaType('page')
              .child(S.documentTypeList('page').title('Alle sider')),
            S.divider(),
            S.listItem()
              .title('👤 Forfattere')
              .schemaType('author')
              .child(S.documentTypeList('author').title('Forfattere')),
            S.listItem()
              .title('🏷️ Kategorier')
              .schemaType('category')
              .child(S.documentTypeList('category').title('Kategorier')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  studio: {
    components: {
      layout: WideStudioLayout,
    },
  },
})
