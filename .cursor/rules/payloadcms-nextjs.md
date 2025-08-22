# PayloadCMS Next.js Development Rules

## Project Context

This is a PayloadCMS 3.x website template with Next.js 15, TypeScript 5.7.3, React 19.1.0, and TailwindCSS. Follow these rules for all code generation and modifications.

## TypeScript Standards

- ALWAYS use strict TypeScript with proper typing
- Use interfaces for component props, never implicit any
- Prefer const assertions for better type inference: `as const`
- Use template literal types for routes and API endpoints
- Implement proper Server Component typing with Promise-based params

```typescript
// Correct Server Component typing
interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params
}
```

## Component Development

- Use PascalCase for components, camelCase for props/variables
- Extend proper HTML element types: `ComponentProps<'div'>`
- Always use the `cn()` utility for conditional className merging
- Prefer Server Components by default, only use Client Components when necessary
- Structure components with proper prop spreading and forwardRef when needed

```typescript
interface ComponentProps extends ComponentProps<'div'> {
  variant?: 'default' | 'outline'
  children: React.ReactNode
}

export function Component({ variant = 'default', className, children, ...props }: ComponentProps) {
  return (
    <div className={cn('base-styles', variant === 'outline' && 'outline-styles', className)} {...props}>
      {children}
    </div>
  )
}
```

## PayloadCMS Integration

- ALWAYS use generated types from '@/payload-types'
- Use proper typing for collection queries and block components
- Implement revalidation hooks for content updates
- Use `getPayloadHMR` for server-side data fetching

```typescript
import type { Post, Page } from '@/payload-types'
import { getPayloadHMR } from '@payloadcms/next/utilities'

// Proper collection typing
const posts: Post[] = await payload.find({
  collection: 'posts',
  where: { status: { equals: 'published' } },
})
```

## Next.js App Router Patterns

- Prefer parallel data fetching with Promise.all()
- Implement proper error.tsx and loading.tsx files
- Use dynamic imports for heavy client components
- Always handle async/await properly in Server Components
- Use revalidatePath() in hooks for cache invalidation

## File Structure Adherence

```
src/
├── app/(frontend)/     # Public routes
├── app/(payload)/      # Admin routes
├── components/ui/      # Basic UI (shadcn/ui)
├── components/         # Feature components
├── collections/        # PayloadCMS collections
├── blocks/            # Layout builder blocks
├── utilities/         # Helper functions
└── hooks/             # Custom React hooks
```

## Performance Requirements

- Use Next.js Image component with proper sizing
- Implement Suspense boundaries for client components
- Configure proper caching and revalidation
- Use lazy loading for non-critical components

## Security & Environment

- Never commit sensitive data or API keys
- Properly type environment variables in environment.d.ts
- Implement proper access control patterns
- Use proper error handling with try/catch blocks

## Code Quality Enforcement

- Run `pnpm generate:types` after any PayloadCMS schema changes
- Prefer composition over inheritance
- Use meaningful variable and function names
- Implement proper JSDoc comments for complex functions
- Follow the established naming conventions strictly

## Testing Requirements

- Write component tests with Vitest + Testing Library
- Implement E2E tests with Playwright for critical user flows
- Test both server and client component behavior
- Validate accessibility standards (WCAG compliance)

## Import Organization

```typescript
// 1. React/Next.js imports
import { type ComponentProps } from 'react'
import Image from 'next/image'

// 2. Third-party libraries
import { cn } from '@/utilities/ui'

// 3. Internal types and utilities
import type { Post } from '@/payload-types'
import { formatDate } from '@/utilities/formatDate'

// 4. Relative imports
import { Button } from './Button'
```

## Error Handling

- Always implement proper error boundaries
- Use proper TypeScript error typing
- Log errors appropriately for debugging
- Provide meaningful error messages to users
- Handle async operations with proper try/catch

## Accessibility Standards

- Include proper ARIA labels and roles
- Ensure keyboard navigation support
- Implement proper heading hierarchy (h1 → h6)
- Use semantic HTML elements appropriately
- Test with screen readers in mind

## Development Workflow Enforcement

1. Start with `pnpm dev` (includes NODE_TLS_REJECT_UNAUTHORIZED=0)
2. Access admin at `http://localhost:3000/admin`
3. Generate types after schema changes: `pnpm generate:types`
4. Run tests before commits: `pnpm test`
5. Build verification: `pnpm build`

These rules should be applied to ALL code generation, modifications, and suggestions within this PayloadCMS Next.js project.
