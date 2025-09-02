import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const CommonCoreStateStandards: CollectionConfig = {
  slug: 'common-core-state-standards',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['code', 'subject', 'grade', 'standard_type', 'active', 'updatedAt'],
    listSearchableFields: ['code'],
  },
  // This config controls what's populated by default when a standard is referenced
  defaultPopulate: {
    code: {
      code_name: true,
    },
    subject: true,
    grade: true,
    standard_type: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    {
      name: 'code',
      type: 'relationship',
      relationTo: 'common-core-codes',
      required: true,
      unique: true,
      label: 'Common Core Code',
      admin: {
        description:
          'Common Core code reference (e.g., "RL.6.3", "6.NS.A.1") - Each code can only be used once',
        isSortable: true,
      },
    },
    {
      name: 'statement',
      type: 'richText',
      required: true,
      admin: {
        description: 'Full text of the standard statement',
      },
    },
    {
      name: 'subject',
      type: 'relationship',
      relationTo: 'subjects',
      required: true,
      admin: {
        description: 'Academic subject this standard belongs to',
      },
    },
    {
      name: 'grade',
      type: 'relationship',
      relationTo: 'grades',
      required: true,
      admin: {
        description: 'Grade level for this standard',
      },
    },
    {
      name: 'standard_type',
      type: 'relationship',
      relationTo: 'standard-types',
      required: true,
      admin: {
        description: 'Type of standard (e.g., Reading Literature, Number Operations)',
      },
    },

    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata about this standard',
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this standard is currently active',
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this standard',
        position: 'sidebar',
      },
    },
  ],
  // Add compound index for efficient querying
  indexes: [
    {
      fields: ['subject', 'grade', 'standard_type'],
    },
    {
      fields: ['code'],
      unique: true,
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data && data.code) {
          try {
            const codeId = typeof data.code === 'object' ? data.code.id : data.code
            const codeDoc = await req.payload.findByID({
              collection: 'common-core-codes',
              id: codeId,
            })
            data.title = codeDoc.code_name || 'Untitled Standard'
          } catch (error) {
            data.title = 'Untitled Standard'
          }
        } else {
          data.title = 'Untitled Standard'
        }
        return data
      },
    ],
    afterRead: [
      async ({ doc, req }) => {
        if (doc && doc.code && !doc.title) {
          try {
            const codeId = typeof doc.code === 'object' ? doc.code.id : doc.code
            const codeDoc = await req.payload.findByID({
              collection: 'common-core-codes',
              id: codeId,
            })
            doc.title = codeDoc.code_name || 'Untitled Standard'
          } catch (error) {
            doc.title = 'Untitled Standard'
          }
        }
        return doc
      },
    ],
  },
}
