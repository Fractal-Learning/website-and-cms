import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-vercel-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Rename abbreviation column to tag in standard_types table
  await payload.db.drizzle.execute(`
    ALTER TABLE "standard_types" RENAME COLUMN "abbreviation" TO "tag";
  `)

  // Drop the old index that referenced abbreviation
  await payload.db.drizzle.execute(`
    DROP INDEX IF EXISTS "subject_abbreviation_idx";
  `)

  // Create new index for subject + tag combination
  await payload.db.drizzle.execute(`
    CREATE UNIQUE INDEX "subject_tag_idx" ON "standard_types" USING btree ("subject", "tag");
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Drop the new tag index
  await payload.db.drizzle.execute(`
    DROP INDEX IF EXISTS "subject_tag_idx";
  `)

  // Rename tag column back to abbreviation
  await payload.db.drizzle.execute(`
    ALTER TABLE "standard_types" RENAME COLUMN "tag" TO "abbreviation";
  `)

  // Recreate the old abbreviation index
  await payload.db.drizzle.execute(`
    CREATE UNIQUE INDEX "subject_abbreviation_idx" ON "standard_types" USING btree ("subject", "abbreviation");
  `)
}
