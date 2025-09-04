import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { resendAdapter } from '@payloadcms/email-resend'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { CommonCoreCodes } from './models/CommonCoreCodes'
import { CommonCoreStateStandards } from './models/CommonCoreStateStandards'

import { Concepts } from './models/Concepts'
import { EssentialQuestions } from './models/EssentialQuestions'
import { Grades } from './models/Grades'
import { KidTranslations } from './models/KidTranslations'
import { LearningOutcomes } from './models/LearningOutcomes'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Skills } from './models/Skills'
import { StandardTypes } from './models/StandardTypes'
import { States } from './models/States'
import { Strategies } from './models/Strategies'
import { Subjects } from './models/Subjects'
import { SkillUniversalQuestions } from './models/SkillUniversalQuestions'
import { ConceptUniversalQuestions } from './models/ConceptUniversalQuestions'
import { StateStandards } from './models/StateStandards'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isProd = process.env.NODE_ENV === 'production'

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
      ssl: process.env.POSTGRES_URL?.includes('localhost')
        ? false
        : {
            rejectUnauthorized: false,
          },
    },
    // Use push mode in production if migrations are failing
    // This will auto-sync the schema without requiring explicit migrations
    // push: process.env.FORCE_SCHEMA_SYNC === 'true' ? true : !isProd,
  }),

  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    // Subjects,
    // StandardTypes,
    // States,
    // Grades,
    // CommonCoreCodes,
    // CommonCoreStateStandards,
    // StateStandards,
    // Concepts,
    // ConceptUniversalQuestions,
    // LearningOutcomes,
    // EssentialQuestions,
    // Skills,
    // SkillUniversalQuestions,
    // Strategies,
    // KidTranslations,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Add email configuration
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: 'noreply@fractallearning.com',
        defaultFromName: 'Fractal Learning',
      })
    : undefined,
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
