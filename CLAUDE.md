# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `pnpm dev` - Start development server (runs Next.js with PayloadCMS admin panel)
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality checks
- `pnpm lint:fix` - Run ESLint with automatic fixes

### Testing
- `pnpm test` - Run all tests (integration + end-to-end)
- `pnpm test:int` - Run integration tests (Vitest)
- `pnpm test:e2e` - Run end-to-end tests (Playwright)

### PayloadCMS Specific
- `pnpm payload` - Access Payload CLI
- `pnpm payload migrate:create` - Create new database migration
- `pnpm payload migrate` - Run pending migrations
- `pnpm generate:types` - Generate TypeScript types from Payload config
- `pnpm generate:importmap` - Generate import map for admin panel

### Database Management
- `pnpm ci` - Run migrations and build (for deployment)

## Architecture Overview

This is a **PayloadCMS website template** built with Next.js App Router, featuring:

### Core Stack
- **PayloadCMS 3.x** - Headless CMS with admin panel
- **Next.js 15** - Full-stack React framework with App Router
- **TypeScript** - Type safety throughout
- **Vercel Postgres** - Database adapter
- **Vercel Blob Storage** - File storage
- **TailwindCSS + shadcn/ui** - Styling and components
- **Lexical** - Rich text editor

### Application Structure

#### Frontend (`src/app/(frontend)/`)
- **Layout Builder Architecture** - Pages and posts use flexible block-based layouts
- **Static Generation** - Pages are statically generated with on-demand revalidation
- **Draft Preview** - Live preview of unpublished content
- **SEO Integration** - Built-in SEO plugin with metadata generation

#### Admin Panel (`src/app/(payload)/`)
- **PayloadCMS Admin** - Full-featured content management interface
- **API Routes** - Auto-generated REST and GraphQL APIs
- **Authentication** - User management with role-based access

#### Collections (`src/collections/`)
- **Pages** - Static pages with layout builder
- **Posts** - Blog posts with categories and layout builder
- **Media** - File uploads with automatic image optimization
- **Categories** - Nested taxonomy for organizing posts
- **Users** - Authentication and user management

#### Blocks (`src/blocks/`)
Layout building blocks for flexible page composition:
- **Banner** - Hero sections with various impact levels
- **Content** - Rich text content with Lexical editor
- **MediaBlock** - Image/video display with captions
- **ArchiveBlock** - Dynamic content listings
- **CallToAction** - Conversion-focused sections
- **Form** - Contact forms with field validation

#### Key Configuration Files
- `src/payload.config.ts` - Main PayloadCMS configuration
- `src/payload-types.ts` - Auto-generated TypeScript types
- Database migrations in `src/migrations/`

### Important Patterns

#### Revalidation Hooks
On-demand revalidation is implemented via `afterChange` hooks in collections to update static pages when content changes.

#### Access Control
- Public users can view published content
- Authenticated users can access admin panel and unpublished content
- Draft/publish workflow with version control

#### Environment Setup
Required environment variables:
- `POSTGRES_URL` - Database connection
- `BLOB_READ_WRITE_TOKEN` - File storage access
- `PAYLOAD_SECRET` - JWT signing secret
- `CRON_SECRET` - Scheduled jobs authentication
- `PREVIEW_SECRET` - Draft preview security

### Testing Strategy
- **Integration Tests** (Vitest) - API endpoints and business logic in `tests/int/`
- **E2E Tests** (Playwright) - Full user flows in `tests/e2e/`
- Test setup uses JSDOM for component testing

### Deployment Considerations
- Uses Vercel-specific adapters for database and storage
- Supports Docker development environment
- Requires migration runs on deployment
- Scheduled publishing uses Vercel Cron (daily limit on free tier)

### Development Workflow
1. Run `pnpm dev` to start development server
2. Access admin panel at `/admin`
3. Use seed data via "Seed database" button in admin
4. Frontend at root path shows the generated website
5. Run tests before committing changes