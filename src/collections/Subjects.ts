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
    defaultColumns: ['name', 'abbreviation', 'active', 'updatedAt'],
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
      name: 'abbreviation',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Short abbreviation (e.g., "Math", "ELA", "Science")',
      },
    },
    {
      name: 'code',
      type: 'text',
      unique: true,
      admin: {
        description: 'Subject code for standards (e.g., "RL", "RF", "NBT")',
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
      name: 'display_color',
      type: 'text',
      admin: {
        description: 'Hex color code for UI display (e.g., "#3B82F6")',
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
