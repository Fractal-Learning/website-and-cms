import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const LearningOutcomes: CollectionConfig = {
  slug: 'learning-outcomes',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'statement',
    defaultColumns: ['statement', 'concept', 'assessment_type', 'sort', 'updatedAt'],
  },
  fields: [
    {
      name: 'statement',
      type: 'richText',
      required: true,
      admin: {
        description: 'The learning outcome statement (supports Markdown)',
      },
    },
    {
      name: 'concept',
      type: 'relationship',
      relationTo: 'concepts',
      required: true,
      admin: {
        description: 'The concept this learning outcome belongs to',
      },
    },
    {
      name: 'success_criteria',
      type: 'json',
      admin: {
        description: 'Criteria that define successful achievement of this outcome',
      },
    },
    {
      name: 'assessment_type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Formative',
          value: 'formative',
        },
        {
          label: 'Summative',
          value: 'summative',
        },
        {
          label: 'Diagnostic',
          value: 'diagnostic',
        },
        {
          label: 'Benchmark',
          value: 'benchmark',
        },
      ],
      defaultValue: 'formative',
      admin: {
        description: 'Type of assessment for this learning outcome',
      },
    },
    {
      name: 'sort',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order within the concept (lower numbers appear first)',
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this learning outcome is currently active',
        position: 'sidebar',
      },
    },
    {
      name: 'estimated_duration_minutes',
      type: 'number',
      admin: {
        description: 'Estimated time to achieve this outcome (in minutes)',
        position: 'sidebar',
      },
    },
    {
      name: 'difficulty_level',
      type: 'select',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
      admin: {
        description: 'Difficulty level of this learning outcome',
        position: 'sidebar',
      },
    },
  ],
  // Add indexes for efficient querying
  indexes: [
    {
      fields: ['concept', 'sort'],
    },
    {
      fields: ['assessment_type'],
    },
  ],
  // Default sort by concept and then by sort order
  defaultSort: 'sort',
}
