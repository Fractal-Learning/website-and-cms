import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const StateStandards: CollectionConfig = {
  slug: 'state-standards',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'statement',
    defaultColumns: [
      'state_code',
      'state_name',
      'subject',
      'grade',
      'common_core_state_standard',
      'active',
      'updatedAt',
    ],
    description: 'State-specific standards that align with Common Core State Standards',
  },
  fields: [
    {
      name: 'state_code',
      type: 'text',
      required: true,
      maxLength: 2,
      admin: {
        description: 'Two-letter state code (e.g., "CA", "TX", "NY")',
      },
    },
    {
      name: 'state_name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full state name (e.g., "California", "Texas", "New York")',
      },
    },
    {
      name: 'subject',
      type: 'relationship',
      relationTo: 'subjects',
      required: true,
      admin: {
        description: 'Academic subject this state standard belongs to',
      },
    },
    {
      name: 'grade',
      type: 'relationship',
      relationTo: 'grades',
      required: true,
      admin: {
        description: 'Grade level for this state standard',
      },
    },
    {
      name: 'common_core_state_standard',
      type: 'relationship',
      relationTo: 'common-core-state-standards',
      required: true,
      label: 'Common Core State Standard',
      admin: {
        description: 'The Common Core State Standard this state standard aligns with',
      },
    },
    {
      name: 'statement',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The state-specific standard statement',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata about this state standard',
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this state standard is currently active',
        position: 'sidebar',
      },
    },
  ],
  // Add indexes for efficient querying
  indexes: [
    {
      fields: ['state_code', 'subject', 'grade'],
    },
    {
      fields: ['common_core_state_standard'],
    },
    {
      fields: ['state_code'],
    },
  ],
  // Default sort by state and grade
  defaultSort: 'state_code',
}
