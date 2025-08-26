import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const EssentialQuestions: CollectionConfig = {
  slug: 'essential-questions',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'learning_outcome', 'sort', 'updatedAt'],
    description: 'Essential questions that drive learning outcomes',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      admin: {
        description: 'The essential question that drives learning',
      },
    },
    {
      name: 'learning_outcome',
      type: 'relationship',
      relationTo: 'learning-outcomes',
      required: true,
      unique: true,
      admin: {
        description: 'The learning outcome this question drives (one-to-one relationship)',
      },
    },
    {
      name: 'sort',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order for multiple questions (lower numbers appear first)',
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this essential question is currently active',
        position: 'sidebar',
      },
    },
    {
      name: 'context',
      type: 'textarea',
      admin: {
        description: 'Additional context or background for this question',
        position: 'sidebar',
      },
    },
  ],
  // Indexes for efficient querying
  indexes: [
    {
      fields: ['learning_outcome'],
      unique: true,
    },
    {
      fields: ['sort'],
    },
  ],
  // Default sort by sort order
  defaultSort: 'sort',
}
