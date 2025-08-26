import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const KidTranslations: CollectionConfig = {
  slug: 'kid-translations',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'strategy',
    defaultColumns: ['strategy', 'grade_level', 'active', 'updatedAt'],
    description: 'Student-friendly translations of teaching strategies',
  },
  fields: [
    {
      name: 'strategy',
      type: 'relationship',
      relationTo: 'strategies',
      required: true,
      unique: true,
      admin: {
        description: 'The strategy this translation explains (one-to-one relationship)',
      },
    },
    {
      name: 'translation',
      type: 'richText',
      required: true,
      admin: {
        description: 'Student-friendly explanation of the strategy (supports Markdown)',
      },
    },
    {
      name: 'grade_level',
      type: 'select',
      options: [
        { label: 'K-2', value: 'k_2' },
        { label: '3-5', value: '3_5' },
        { label: '6-8', value: '6_8' },
        { label: '9-12', value: '9_12' },
      ],
      defaultValue: 'k_2',
      admin: {
        description: 'Grade level range for this translation',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this translation is currently active',
        position: 'sidebar',
      },
    },
    {
      name: 'vocabulary_support',
      type: 'array',
      fields: [
        {
          name: 'term',
          type: 'text',
          required: true,
          admin: {
            description: 'Key vocabulary term',
          },
        },
        {
          name: 'definition',
          type: 'text',
          required: true,
          admin: {
            description: 'Kid-friendly definition',
          },
        },
      ],
      admin: {
        description: 'Key vocabulary with kid-friendly definitions',
        position: 'sidebar',
      },
    },
    {
      name: 'examples',
      type: 'array',
      fields: [
        {
          name: 'example',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Real-world examples kids can relate to',
        position: 'sidebar',
      },
    },
    {
      name: 'motivational_message',
      type: 'text',
      admin: {
        description: 'Encouraging message for students',
        position: 'sidebar',
      },
    },
    {
      name: 'success_criteria_kid_friendly',
      type: 'richText',
      admin: {
        description: 'How students will know they succeeded (in kid language)',
      },
    },
    {
      name: 'reading_level',
      type: 'select',
      options: [
        { label: 'Pre-K', value: 'pre_k' },
        { label: 'Kindergarten', value: 'k' },
        { label: 'Grade 1', value: '1' },
        { label: 'Grade 2', value: '2' },
        { label: 'Grade 3', value: '3' },
        { label: 'Grade 4', value: '4' },
        { label: 'Grade 5', value: '5' },
        { label: 'Grade 6', value: '6' },
        { label: 'Grade 7', value: '7' },
        { label: 'Grade 8', value: '8' },
        { label: 'Grade 9', value: '9' },
        { label: 'Grade 10', value: '10' },
        { label: 'Grade 11', value: '11' },
        { label: 'Grade 12', value: '12' },
      ],
      admin: {
        description: 'Target reading level for this translation',
        position: 'sidebar',
      },
    },
  ],
  // Indexes for efficient querying
  indexes: [
    {
      fields: ['strategy'],
      unique: true,
    },
    {
      fields: ['grade_level'],
    },
    {
      fields: ['reading_level'],
    },
  ],
}
