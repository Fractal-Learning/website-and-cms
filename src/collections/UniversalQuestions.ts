import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const UniversalQuestions: CollectionConfig = {
  slug: 'universal-questions',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'skill', 'sort', 'updatedAt'],
    description: 'Universal questions that prompt skill development',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      admin: {
        description: 'The universal question that prompts this skill',
      },
    },
    {
      name: 'skill',
      type: 'relationship',
      relationTo: 'skills',
      required: true,
      admin: {
        description: 'The skill this question prompts',
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
        description: 'Whether this universal question is currently active',
        position: 'sidebar',
      },
    },
    {
      name: 'question_type',
      type: 'select',
      options: [
        { label: 'Open-ended', value: 'open_ended' },
        { label: 'Reflective', value: 'reflective' },
        { label: 'Analytical', value: 'analytical' },
        { label: 'Evaluative', value: 'evaluative' },
        { label: 'Creative', value: 'creative' },
      ],
      defaultValue: 'open_ended',
      admin: {
        description: 'Type of universal question',
        position: 'sidebar',
      },
    },
    {
      name: 'context',
      type: 'textarea',
      admin: {
        description: 'Additional context or guidance for using this question',
        position: 'sidebar',
      },
    },
    {
      name: 'suggested_followups',
      type: 'array',
      fields: [
        {
          name: 'followup_question',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Suggested follow-up questions to deepen thinking',
        position: 'sidebar',
      },
    },
  ],
  // Indexes for efficient querying
  indexes: [
    {
      fields: ['skill', 'sort'],
    },
    {
      fields: ['question_type'],
    },
  ],
  // Default sort by skill and then sort order
  defaultSort: 'sort',
}
