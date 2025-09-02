import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Strategies: CollectionConfig = {
  slug: 'strategies',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'skill', 'sort', 'updatedAt'],
    description: 'Teaching and learning strategies for skills',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the teaching/learning strategy',
      },
    },
    {
      name: 'skill',
      type: 'relationship',
      relationTo: 'skills',
      required: true,
      admin: {
        description: 'The skill this strategy helps develop',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Detailed description of the strategy (supports Markdown)',
      },
    },
    {
      name: 'sort',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order within the skill (lower numbers appear first)',
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this strategy is currently active',
        position: 'sidebar',
      },
    },
  ],
  // Indexes for efficient querying
  indexes: [
    {
      fields: ['skill', 'sort'],
    },
  ],
  // Default sort by skill and then sort order
  defaultSort: 'sort',
}
