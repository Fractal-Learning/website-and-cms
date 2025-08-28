import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-vercel-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Add common_core_standards column to concepts table
  await payload.db.drizzle.execute(`
    ALTER TABLE "concepts" 
    ADD COLUMN "common_core_standards" JSONB;
  `)

  // Copy existing relationships from bridge table to concepts table
  // This will populate the new JSONB field with the standard IDs
  await payload.db.drizzle.execute(`
    UPDATE "concepts" 
    SET "common_core_standards" = (
      SELECT jsonb_agg(ccs."common_core_standard") 
      FROM "concept_common_core_state_standards" ccs 
      WHERE ccs."concept" = "concepts"."id"
    );
  `)

  // Drop the bridge table
  await payload.db.drizzle.execute(`
    DROP TABLE IF EXISTS "concept_common_core_state_standards";
  `)

  // Drop any related indexes
  await payload.db.drizzle.execute(`
    DROP INDEX IF EXISTS "concept_common_core_state_standards_concept_common_core_standard_unique";
    DROP INDEX IF EXISTS "concept_common_core_state_standards_concept_idx";
    DROP INDEX IF EXISTS "concept_common_core_state_standards_common_core_standard_idx";
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Recreate the bridge table
  await payload.db.drizzle.execute(`
    CREATE TABLE "concept_common_core_state_standards" (
      "id" TEXT PRIMARY KEY,
      "concept" TEXT NOT NULL,
      "common_core_standard" TEXT NOT NULL,
      "notes" TEXT,
      "active" BOOLEAN DEFAULT true,
      "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `)

  // Recreate indexes
  await payload.db.drizzle.execute(`
    CREATE UNIQUE INDEX "concept_common_core_state_standards_concept_common_core_standard_unique" 
    ON "concept_common_core_state_standards" ("concept", "common_core_standard");
    
    CREATE INDEX "concept_common_core_state_standards_concept_idx" 
    ON "concept_common_core_state_standards" ("concept");
    
    CREATE INDEX "concept_common_core_state_standards_common_core_standard_idx" 
    ON "concept_common_core_state_standards" ("common_core_standard");
  `)

  // Copy data back from concepts table to bridge table
  // Note: This is a simplified approach - you may need to handle the JSONB data more carefully
  await payload.db.drizzle.execute(`
    INSERT INTO "concept_common_core_state_standards" ("id", "concept", "common_core_standard", "created_at", "updated_at")
    SELECT 
      gen_random_uuid()::text,
      c."id",
      jsonb_array_elements_text(c."common_core_standards"),
      c."created_at",
      c."updated_at"
    FROM "concepts" c
    WHERE c."common_core_standards" IS NOT NULL;
  `)

  // Remove the common_core_standards column from concepts
  await payload.db.drizzle.execute(`
    ALTER TABLE "concepts" 
    DROP COLUMN "common_core_standards";
  `)
}
