# CLAUDE_INSTRUCTIONS.md

This file provides comprehensive guidance for Claude Code when working with Next.js/TypeScript projects, with specific focus on this PayloadCMS website template.

## Project Overview

This is a **PayloadCMS 3.x website template** built with:
- **Next.js 15** with App Router
- **TypeScript 5.7.3** with strict mode
- **React 19.1.0** 
- **PayloadCMS 3.49.0** as headless CMS
- **Vercel** deployment platform with Postgres & Blob storage
- **TailwindCSS + shadcn/ui** for styling
- **pnpm** as package manager

## Development Commands

### Essential Commands
- `pnpm dev` - Start development server (Next.js + PayloadCMS admin)
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality
- `pnpm lint:fix` - Run ESLint with auto-fixes

### Testing & Quality Assurance
- `pnpm test` - Run all tests (integration + e2e)
- `pnpm test:int` - Run integration tests (Vitest)
- `pnpm test:e2e` - Run e2e tests (Playwright)

### PayloadCMS Specific
- `pnpm payload` - Access Payload CLI
- `pnpm generate:types` - Generate TypeScript types from Payload config
- `pnpm payload migrate` - Run database migrations

## TypeScript Best Practices

### Strict Configuration Requirements
- **Always use strict mode**: `"strict": true` in tsconfig.json
- **Enable additional checks**: 
  - `"noUncheckedIndexedAccess": true`
  - `"noImplicitReturns": true`
  - `"exactOptionalPropertyTypes": true`

### Type Safety Patterns

#### Component Props Definition
```typescript
// Use interfaces for component props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}

// Use const assertions for better type inference
const BUTTON_VARIANTS = {
  primary: 'bg-blue-600 hover:bg-blue-700',
  secondary: 'bg-gray-600 hover:bg-gray-700',
  outline: 'border-2 border-blue-600 hover:bg-blue-50'
} as const

type ButtonVariant = keyof typeof BUTTON_VARIANTS
```

#### Server Component Types
```typescript
// Type server component props properly
interface ServerPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params, searchParams }: ServerPageProps) {
  const { slug } = await params
  // Component logic
}
```

#### API Route Typing
```typescript
// Type API routes with proper Next.js types
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Type-safe request handling
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // Type-safe parameter access
}
```

### Modern TypeScript Features (2025)

#### Template Literal Types
```typescript
type Route = `/admin/${string}` | `/api/${string}` | '/'
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type ApiEndpoint = `/${string}/api/${string}`
```

#### Satisfies Operator
```typescript
const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280'
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem'
  }
} satisfies Record<string, Record<string, string>>
```

## Next.js App Router Best Practices

### Project Structure
```
src/
├── app/                    # App Router pages
│   ├── (frontend)/        # Frontend routes group
│   ├── (payload)/         # Admin routes group
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Shared components
│   ├── ui/               # Basic UI components (shadcn/ui)
│   └── features/         # Feature-specific components
├── collections/          # PayloadCMS collections
├── blocks/              # Layout builder blocks
├── utilities/           # Helper functions
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── lib/                # Third-party configurations
```

### Server vs Client Components

#### Server Components (Prefer by default)
- Data fetching
- Database queries
- Static content rendering
- SEO metadata generation

```typescript
// Server Component
import { getPayloadHMR } from '@payloadcms/next/utilities'

export default async function BlogPage() {
  const payload = await getPayloadHMR({ config })
  const posts = await payload.find({ collection: 'posts' })
  
  return (
    <div>
      {posts.docs.map(post => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  )
}
```

#### Client Components (Use when needed)
- Interactive elements
- Event handlers
- Browser APIs
- State management

```typescript
'use client'

import { useState } from 'react'

export default function InteractiveForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Interactive form elements */}
    </form>
  )
}
```

### Data Fetching Patterns

#### Parallel Data Fetching
```typescript
export default async function Page() {
  // Fetch data in parallel
  const [posts, categories] = await Promise.all([
    payload.find({ collection: 'posts' }),
    payload.find({ collection: 'categories' })
  ])
  
  return <BlogLayout posts={posts} categories={categories} />
}
```

#### Error Boundaries and Loading States
```typescript
// error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

// loading.tsx
export default function Loading() {
  return <div>Loading...</div>
}
```

## Component Development Guidelines

### Naming Conventions
- **Components**: PascalCase (`UserProfile`, `BlogPost`)
- **Files**: PascalCase for components, camelCase for utilities
- **Props/Variables**: camelCase (`userName`, `isLoading`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)

### Component Structure Template
```typescript
import { type ComponentProps } from 'react'
import { cn } from '@/utilities/ui'

interface ComponentNameProps extends ComponentProps<'div'> {
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function ComponentName({ 
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: ComponentNameProps) {
  return (
    <div 
      className={cn(
        'base-styles',
        variant === 'outline' && 'outline-styles',
        size === 'sm' && 'small-styles',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

### Custom Hooks Pattern
```typescript
import { useState, useEffect } from 'react'

interface UseApiOptions<T> {
  endpoint: string
  initialData?: T
}

export function useApi<T>({ endpoint, initialData }: UseApiOptions<T>) {
  const [data, setData] = useState<T | undefined>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Hook implementation
  
  return { data, loading, error, refetch }
}
```

## PayloadCMS Integration Best Practices

### Collection Types
```typescript
// Use generated types from Payload
import type { Post, Page, Media } from '@/payload-types'

// Type collection queries
const posts: Post[] = await payload.find({
  collection: 'posts',
  where: {
    status: { equals: 'published' }
  }
})
```

### Block Component Patterns
```typescript
// blocks/MyBlock/Component.tsx
import type { MyBlock } from '@/payload-types'

interface MyBlockProps {
  block: MyBlock
}

export function MyBlockComponent({ block }: MyBlockProps) {
  return (
    <section>
      <h2>{block.title}</h2>
      {block.content && <p>{block.content}</p>}
    </section>
  )
}
```

### Revalidation Hooks
```typescript
// hooks/revalidatePost.ts
import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook } from 'payload'

export const revalidatePost: CollectionAfterChangeHook = ({ doc, operation }) => {
  if (operation === 'update' || operation === 'create') {
    revalidatePath(`/posts/${doc.slug}`)
    revalidatePath('/posts')
  }
  
  return doc
}
```

## Performance Optimization

### Image Optimization
```typescript
import Image from 'next/image'
import type { Media } from '@/payload-types'

interface OptimizedImageProps {
  media: Media
  alt: string
  sizes?: string
}

export function OptimizedImage({ media, alt, sizes }: OptimizedImageProps) {
  if (!media || typeof media === 'string') return null
  
  return (
    <Image
      src={media.url!}
      alt={alt}
      width={media.width!}
      height={media.height!}
      sizes={sizes}
      className="object-cover"
    />
  )
}
```

### Bundle Optimization
```typescript
// Dynamic imports for client components
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

export function OptimizedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

## Testing Strategy

### Component Testing (Vitest + Testing Library)
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })
  
  it('applies variant styles', () => {
    render(<Button variant="outline">Outline Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-2')
  })
})
```

### E2E Testing (Playwright)
```typescript
import { test, expect } from '@playwright/test'

test('blog post page loads correctly', async ({ page }) => {
  await page.goto('/posts/example-post')
  
  await expect(page.locator('h1')).toContainText('Example Post')
  await expect(page.locator('article')).toBeVisible()
})
```

## Security & Environment Best Practices

### Environment Variables
```typescript
// environment.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    PAYLOAD_SECRET: string
    POSTGRES_URL: string
    BLOB_READ_WRITE_TOKEN: string
    PREVIEW_SECRET: string
    readonly NODE_ENV: 'development' | 'production' | 'test'
  }
}
```

### Access Control Patterns
```typescript
// access/authenticated.ts
import type { Access } from 'payload'

export const authenticated: Access = ({ req }) => {
  return Boolean(req.user)
}

// access/publishedOrOwner.ts
export const publishedOrOwner: Access = ({ req }) => {
  if (req.user) return true
  
  return {
    status: { equals: 'published' }
  }
}
```

## Error Handling & Logging

### Global Error Handling
```typescript
// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

### API Error Responses
```typescript
import { NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // API logic
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

## Deployment & Production Considerations

### Build Optimization
- Use `output: 'standalone'` in next.config.js for Docker deployments
- Configure proper caching headers
- Implement proper CSP (Content Security Policy)
- Use environment-specific configurations

### Monitoring & Analytics
```typescript
// Implement with Vercel Analytics
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## Code Quality Standards

### ESLint Configuration
- Extend `@next/eslint-config-next`
- Use TypeScript ESLint rules
- Configure Prettier integration
- Set up import sorting

### Pre-commit Hooks
- Run `pnpm lint:fix` before commits
- Run `pnpm test` for critical changes
- Generate types with `pnpm generate:types`
- Validate TypeScript compilation

## Development Workflow

1. **Start development**: `pnpm dev`
2. **Access admin panel**: `http://localhost:3000/admin`
3. **Seed initial data**: Use admin panel "Seed database" button
4. **Generate types**: `pnpm generate:types` after schema changes
5. **Test changes**: `pnpm test` before committing
6. **Build verification**: `pnpm build` before deployment

## Important Reminders

- **NEVER** commit sensitive data or API keys
- **ALWAYS** run type generation after Payload schema changes
- **PREFER** Server Components for better performance
- **USE** proper TypeScript types throughout
- **IMPLEMENT** proper error boundaries
- **FOLLOW** the established file structure patterns
- **TEST** both integration and e2e scenarios
- **VALIDATE** accessibility standards (WCAG)

This document should be consulted for all development decisions within this Next.js/TypeScript/PayloadCMS project.