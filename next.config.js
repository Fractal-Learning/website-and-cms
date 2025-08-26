import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  // Add build configuration for PayloadCMS
  experimental: {
    // Enable server components
    serverComponentsExternalPackages: ['payload'],
  },
  // Configure build output
  output: 'standalone',
  // Handle database access during build
  env: {
    PAYLOAD_PUBLIC_SERVER_URL: NEXT_PUBLIC_SERVER_URL,
  },
}

export default withPayload(nextConfig, { 
  devBundleServerPackages: false,
  // Configure build-time behavior
  buildOptions: {
    // Disable static generation for dynamic routes during build
    disableStaticGeneration: true,
  }
})
