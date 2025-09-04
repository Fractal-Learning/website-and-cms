import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const States: CollectionConfig = {
  slug: 'states',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'state_name',
    defaultColumns: ['state_abbreviation', 'state_name', 'updatedAt'],
    description: 'US States with abbreviations and full names',
  },
  fields: [
    {
      name: 'state_abbreviation',
      type: 'text',
      required: true,
      unique: true,
      maxLength: 2,
      admin: {
        description: 'Two-letter state abbreviation (e.g., "CA", "TX", "NY")',
      },
    },
    {
      name: 'state_name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Full state name (e.g., "California", "Texas", "New York")',
      },
    },
  ],
  indexes: [
    {
      fields: ['state_abbreviation'],
      unique: true,
    },
    {
      fields: ['state_name'],
      unique: true,
    },
  ],
  defaultSort: 'state_name',
}
