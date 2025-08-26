import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Skills: CollectionConfig = {
  slug: 'skills',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'essential_question', 'sort', 'updatedAt'],
    description: 'Specific skills defined by essential questions',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the skill',
      },
    },
    {
      name: 'essential_question',
      type: 'relationship',
      relationTo: 'essential-questions',
      required: true,
      unique: true,
      admin: {
        description: 'The essential question that defines this skill (one-to-one relationship)',
      },
    },
    {
      name: 'big_idea',
      type: 'richText',
      required: true,
      admin: {
        description: 'The big idea behind this skill (supports Markdown)',
      },
    },
    {
      name: 'sort',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order for skills (lower numbers appear first)',
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this skill is currently active',
        position: 'sidebar',
      },
    },
    {
      name: 'prerequisites',
      type: 'relationship',
      relationTo: 'skills',
      hasMany: true,
      admin: {
        description: 'Other skills that are prerequisites for this skill',
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
        { label: 'Expert', value: 'expert' },
      ],
      defaultValue: 'beginner',
      admin: {
        description: 'Difficulty level of this skill',
        position: 'sidebar',
      },
    },
    {
      name: 'estimated_hours',
      type: 'number',
      admin: {
        description: 'Estimated hours to master this skill',
        position: 'sidebar',
      },
    },
  ],
  // Indexes for efficient querying
  indexes: [
    {
      fields: ['essential_question'],
      unique: true,
    },
    {
      fields: ['sort'],
    },
    {
      fields: ['difficulty_level'],
    },
  ],
  // Default sort by sort order
  defaultSort: 'sort',
}
