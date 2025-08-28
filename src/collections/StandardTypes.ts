import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const StandardTypes: CollectionConfig = {
  slug: 'standard-types',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'subject', 'tag', 'display_color', 'active', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Standard type name (e.g., "Reading Literature", "Number & Operations")',
      },
    },
    {
      name: 'tag',
      type: 'text',
      required: true,
      admin: {
        description: 'Standard type tag (e.g., "RL", "NBT", "OA")',
      },
    },
    {
      name: 'subject',
      type: 'relationship',
      relationTo: 'subjects',
      required: true,
      admin: {
        description: 'The subject this standard type belongs to',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Detailed description of this standard type',
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
        description: 'Numeric order for sorting within the subject',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this standard type is currently active',
      },
    },
  ],
  // Add index for unique constraint on subject + tag combination
  indexes: [
    {
      fields: ['subject', 'tag'],
      unique: true,
    },
  ],
}
