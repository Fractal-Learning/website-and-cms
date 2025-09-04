# Production Migration Fix Guide

## Problem

The production deployment is failing because the initial migration (`20250902_173328_initial`) is trying to create database objects that may already exist, causing PostgreSQL errors.

## Root Cause

The error occurs because:

1. The initial migration contains a very large SQL statement (1400+ lines)
2. Some database objects (tables, types, indexes) may already exist in production
3. PostgreSQL throws errors when trying to CREATE objects that already exist
4. The migration system expects a clean database state

## Solutions (Try in Order)

### Solution 1: Use Schema Sync Mode (Recommended)

Temporarily bypass migrations and use Payload's automatic schema synchronization:

1. **Update your Vercel environment variables:**
   - Add `FORCE_SCHEMA_SYNC=true` to your production environment
   - This enables push mode which auto-syncs the schema

2. **Use the safe build command:**
   - In your `vercel.json` or build settings, change the build command from:
     ```
     pnpm run ci
     ```
   - To:
     ```
     FORCE_SCHEMA_SYNC=true pnpm run ci:safe
     ```

### Solution 2: Skip Migration Step Temporarily

If Solution 1 doesn't work, modify your build process:

1. **In Vercel dashboard:**
   - Go to your project settings
   - Change the build command to: `pnpm run ci:safe`
   - This skips the migration step entirely

2. **After successful deployment:**
   - Run migrations manually through the admin panel or API
   - Or connect to your production database and run migrations directly

### Solution 3: Fix the Migration (Advanced)

If you need to keep the migration-based approach:

1. **Connect to your production database** and check what already exists:

   ```sql
   \dt  -- List tables
   \dT+ -- List custom types
   SELECT * FROM payload_migrations; -- Check migration status
   ```

2. **If the migration table exists but the migration isn't recorded:**

   ```sql
   INSERT INTO payload_migrations (name, batch, created_at, updated_at)
   VALUES ('20250902_173328_initial', 1, now(), now());
   ```

3. **If some tables exist but not all:**
   - You'll need to manually create missing tables
   - Use the SQL from the migration file as reference

## Configuration Changes Made

### 1. Updated `payload.config.ts`

```typescript
// Use push mode in production if migrations are failing
push: process.env.FORCE_SCHEMA_SYNC === 'true' ? true : !isProd,
```

### 2. Added Safe Build Command in `package.json`

```json
"ci:safe": "pnpm build"
```

## Prevention for Future

1. **Test migrations in staging** that matches production environment
2. **Use smaller, incremental migrations** instead of large initial migrations
3. **Consider using push mode** for development and careful migrations for production
4. **Always backup your production database** before running migrations

## Environment Variables

Add these to your production environment if using Solution 1:

- `FORCE_SCHEMA_SYNC=true` - Enables automatic schema synchronization

## Troubleshooting

If you continue to have issues:

1. Check your database connection string
2. Verify your database user has CREATE permissions
3. Look at the full error logs in Vercel deployment logs
4. Consider temporarily using push mode until the schema is stable

## Support

The issue is common with Payload CMS initial deployments. The schema sync mode is often more reliable for production deployments than migrations.
