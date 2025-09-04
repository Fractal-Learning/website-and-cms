import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Skills: CollectionConfig = {
  slug: 'skills',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'concept', 'sort', 'updatedAt'],
    description: 'Specific skills defined by concepts',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the skill',
      },
    },
    {
      name: 'concept',
      type: 'relationship',
      relationTo: 'concepts',
      required: true,
      admin: {
        description: 'The concept this skill belongs to',
      },
    },
    {
      name: 'big_idea',
      type: 'richText',
      required: true,
      admin: {
        description: 'The big idea behind this skill (supports Markdown)',
      },
    },
    {
      name: 'sort',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order for skills (lower numbers appear first)',
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this skill is currently active',
        position: 'sidebar',
      },
    },
  ],
  // Indexes for efficient querying
  indexes: [
    {
      fields: ['concept', 'sort'],
    },
  ],
  // Default sort by sort order
  defaultSort: 'sort',
}
