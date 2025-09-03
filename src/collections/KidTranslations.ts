import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const KidTranslations: CollectionConfig = {
  slug: 'kid-translations',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'strategy',
    defaultColumns: ['strategy', 'updatedAt'],
    description: 'Student-friendly translations of teaching strategies',
  },
  fields: [
    {
      name: 'strategy',
      type: 'relationship',
      relationTo: 'strategies',
      required: true,
      unique: true,
      admin: {
        description: 'The strategy this translation explains (one-to-one relationship)',
      },
    },
    {
      name: 'translation',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Student-friendly explanation of the strategy (Markdown supported)',
      },
    },
  ],
  // Index for efficient querying
  indexes: [
    {
      fields: ['strategy'],
      unique: true,
    },
  ],
}
