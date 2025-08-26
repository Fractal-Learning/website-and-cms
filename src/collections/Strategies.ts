import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Strategies: CollectionConfig = {
  slug: 'strategies',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'skill', 'estimated_minutes', 'sort', 'updatedAt'],
    description: 'Teaching and learning strategies for skills',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the teaching/learning strategy',
      },
    },
    {
      name: 'skill',
      type: 'relationship',
      relationTo: 'skills',
      required: true,
      admin: {
        description: 'The skill this strategy helps develop',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Detailed description of the strategy (supports Markdown)',
      },
    },
    {
      name: 'estimated_minutes',
      type: 'number',
      required: true,
      admin: {
        description: 'Estimated time to complete this strategy (in minutes)',
      },
    },
    {
      name: 'sort',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order within the skill (lower numbers appear first)',
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this strategy is currently active',
        position: 'sidebar',
      },
    },
    {
      name: 'strategy_type',
      type: 'select',
      options: [
        { label: 'Individual Work', value: 'individual' },
        { label: 'Pair Work', value: 'pair' },
        { label: 'Small Group', value: 'small_group' },
        { label: 'Whole Class', value: 'whole_class' },
        { label: 'Independent Study', value: 'independent' },
      ],
      defaultValue: 'individual',
      admin: {
        description: 'Type of strategy based on grouping',
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
      defaultValue: 'beginner',
      admin: {
        description: 'Difficulty level of this strategy',
        position: 'sidebar',
      },
    },
    {
      name: 'materials_needed',
      type: 'array',
      fields: [
        {
          name: 'material',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Materials or resources needed for this strategy',
        position: 'sidebar',
      },
    },
    {
      name: 'instructions',
      type: 'richText',
      admin: {
        description: 'Step-by-step instructions for implementing the strategy',
      },
    },
    {
      name: 'assessment_method',
      type: 'text',
      admin: {
        description: 'How to assess student progress with this strategy',
      },
    },
  ],
  // Indexes for efficient querying
  indexes: [
    {
      fields: ['skill', 'sort'],
    },
    {
      fields: ['strategy_type'],
    },
    {
      fields: ['difficulty_level'],
    },
    {
      fields: ['estimated_minutes'],
    },
  ],
  // Default sort by skill and then sort order
  defaultSort: 'sort',
}
