import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Grades: CollectionConfig = {
  slug: 'grades',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['level', 'name', 'updatedAt'],
  },
  fields: [
    {
      name: 'level',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Grade level (K, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full grade name (e.g., "Kindergarten", "First Grade", "Sixth Grade")',
      },
    },
    {
      name: 'sort_order',
      type: 'number',
      required: true,
      admin: {
        description: 'Numeric order for sorting (0 for K, 1 for 1st grade, etc.)',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this grade level is currently active',
      },
    },
  ],
}
