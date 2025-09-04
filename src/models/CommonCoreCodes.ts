import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const CommonCoreCodes: CollectionConfig = {
  slug: 'common-core-codes',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'code_name',
    defaultColumns: ['code_name', 'active', 'created_at', 'updated_at'],
    listSearchableFields: ['code_name'],
  },
  fields: [
    {
      name: 'code_name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Common Core code name (e.g., "RL.6.3", "6.NS.A.1")',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this code is currently active',
        position: 'sidebar',
      },
    },
  ],
  // Add index for efficient querying
  indexes: [
    {
      fields: ['code_name'],
      unique: true,
    },
  ],
}
