import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Subjects: CollectionConfig = {
  slug: 'subjects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tag', 'active', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Subject name (e.g., "Mathematics", "English Language Arts")',
      },
    },
    {
      name: 'tag',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Short tag (e.g., "Math", "ELA", "Science")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Detailed description of the subject area',
      },
    },

    {
      name: 'sort_order',
      type: 'number',
      admin: {
        description: 'Numeric order for sorting subjects',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this subject is currently active',
      },
    },
  ],
}
