import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const LearningOutcomes: CollectionConfig = {
  slug: 'learning-outcomes',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'statement',
    defaultColumns: ['statement', 'concept', 'sort', 'updatedAt'],
  },
  fields: [
    {
      name: 'statement',
      type: 'richText',
      required: true,
      admin: {
        description: 'The learning outcome statement (supports Markdown)',
      },
    },
    {
      name: 'concept',
      type: 'relationship',
      relationTo: 'concepts',
      required: true,
      admin: {
        description: 'The concept this learning outcome belongs to',
      },
    },

    {
      name: 'sort',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order within the concept (lower numbers appear first)',
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this learning outcome is currently active',
        position: 'sidebar',
      },
    },
  ],
  // Add indexes for efficient querying
  indexes: [
    {
      fields: ['concept', 'sort'],
    },
  ],
  // Default sort by concept and then by sort order
  defaultSort: 'sort',
}
