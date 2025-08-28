import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-vercel-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Add display_color column to standard_types table
  await payload.db.drizzle.execute(`
    ALTER TABLE "standard_types" 
    ADD COLUMN "display_color" TEXT;
  `)

  // Copy display_color values from subjects to standard_types
  // This will set the display_color for each standard type based on its subject
  await payload.db.drizzle.execute(`
    UPDATE "standard_types" 
    SET "display_color" = (
      SELECT "display_color" 
      FROM "subjects" 
      WHERE "subjects"."id" = "standard_types"."subject"
    );
  `)

  // Remove display_color column from subjects table
  await payload.db.drizzle.execute(`
    ALTER TABLE "subjects" 
    DROP COLUMN "display_color";
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Add display_color column back to subjects table
  await payload.db.drizzle.execute(`
    ALTER TABLE "subjects" 
    ADD COLUMN "display_color" TEXT;
  `)

  // Copy display_color values back from standard_types to subjects
  // This will restore the original display_color for each subject
  await payload.db.drizzle.execute(`
    UPDATE "subjects" 
    SET "display_color" = (
      SELECT "display_color" 
      FROM "standard_types" 
      WHERE "standard_types"."subject" = "subjects"."id" 
      LIMIT 1
    );
  `)

  // Remove display_color column from standard_types table
  await payload.db.drizzle.execute(`
    ALTER TABLE "standard_types" 
    DROP COLUMN "display_color";
  `)
}
