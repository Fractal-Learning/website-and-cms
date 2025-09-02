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
    defaultColumns: ['state', 'common_core_state_standard', 'active', 'updatedAt'],
    description: 'State-specific standards that align with Common Core State Standards',
  },
  fields: [
    {
      name: 'state',
      type: 'relationship',
      relationTo: 'states',
      required: true,
      admin: {
        description: 'The state this standard applies to',
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
      fields: ['state', 'common_core_state_standard'],
    },
    {
      fields: ['common_core_state_standard'],
    },
    {
      fields: ['state'],
    },
  ],
  // Default sort by state
  defaultSort: 'state',
}
