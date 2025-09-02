import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const CommonCoreStateStandards: CollectionConfig = {
  slug: 'common-core-state-standards',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'subject', 'grade', 'standard_type', 'active', 'updatedAt'],
  },
  fields: [
    {
      name: 'code',
      type: 'relationship',
      relationTo: 'common-core-codes',
      required: true,
      unique: true,
      admin: {
        description: 'Common Core code reference (e.g., "RL.6.3", "6.NS.A.1")',
      },
    },
    {
      name: 'statement',
      type: 'richText',
      required: true,
      admin: {
        description: 'Full text of the standard statement',
      },
    },
    {
      name: 'subject',
      type: 'relationship',
      relationTo: 'subjects',
      required: true,
      admin: {
        description: 'Academic subject this standard belongs to',
      },
    },
    {
      name: 'grade',
      type: 'relationship',
      relationTo: 'grades',
      required: true,
      admin: {
        description: 'Grade level for this standard',
      },
    },
    {
      name: 'standard_type',
      type: 'relationship',
      relationTo: 'standard-types',
      required: true,
      admin: {
        description: 'Type of standard (e.g., Reading Literature, Number Operations)',
      },
    },

    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata about this standard',
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this standard is currently active',
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this standard',
        position: 'sidebar',
      },
    },
  ],
  // Add compound index for efficient querying
  indexes: [
    {
      fields: ['subject', 'grade', 'standard_type'],
    },
    {
      fields: ['code'],
      unique: true,
    },
  ],
}
