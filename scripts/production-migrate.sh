#!/bin/bash

# Production Migration Script for Payload CMS
# This script safely runs migrations in production

set -e  # Exit on any error

echo "🚀 Starting production migration..."

# Check if we're in production
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  Warning: NODE_ENV is not set to 'production'"
    echo "   Current NODE_ENV: $NODE_ENV"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Migration cancelled"
        exit 1
    fi
fi

# Check if database is accessible
echo "🔍 Checking database connection..."
if ! pnpm payload migrate:status > /dev/null 2>&1; then
    echo "❌ Cannot connect to database. Check your POSTGRES_URL environment variable."
    exit 1
fi

echo "✅ Database connection successful"

# Show current migration status
echo "📊 Current migration status:"
pnpm payload migrate:status

# Run migrations
echo "🔄 Running migrations..."
pnpm payload migrate

# Show final status
echo "📊 Final migration status:"
pnpm payload migrate:status

echo "✅ Production migration completed successfully!"
echo ""
echo "Next steps:"
echo "1. Restart your application server"
echo "2. Verify the admin panel is accessible"
echo "3. Test creating/editing content"
