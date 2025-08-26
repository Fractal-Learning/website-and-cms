import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const ConceptCommonCoreStateStandards: CollectionConfig = {
  slug: 'concept-common-core-state-standards',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'concept',
    defaultColumns: ['concept', 'common_core_standard', 'notes', 'updatedAt'],
    description: 'Bridge collection linking concepts to Common Core State Standards',
  },
  fields: [
    {
      name: 'concept',
      type: 'relationship',
      relationTo: 'concepts',
      required: true,
      admin: {
        description: 'The concept being aligned to standards',
      },
    },
    {
      name: 'common_core_standard',
      type: 'relationship',
      relationTo: 'common-core-state-standards',
      required: true,
      admin: {
        description: 'The Common Core State Standard being aligned',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Optional notes about this alignment',
      },
    },
    {
      name: 'alignment_strength',
      type: 'select',
      options: [
        { label: 'Strong', value: 'strong' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Weak', value: 'weak' },
      ],
      defaultValue: 'strong',
      admin: {
        description: 'How strongly this concept aligns with the standard',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this alignment is currently active',
        position: 'sidebar',
      },
    },
  ],
  // Ensure unique concept-standard pairs
  indexes: [
    {
      fields: ['concept', 'common_core_standard'],
      unique: true,
    },
    {
      fields: ['concept'],
    },
    {
      fields: ['common_core_standard'],
    },
  ],
}
