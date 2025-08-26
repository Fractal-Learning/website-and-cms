import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Rename abbreviation column to tag
  await db.execute(sql`
    ALTER TABLE "subjects" RENAME COLUMN "abbreviation" TO "tag";
  `)

  // Drop the code column
  await db.execute(sql`
    ALTER TABLE "subjects" DROP COLUMN "code";
  `)

  // Drop the old abbreviation index if it exists
  await db.execute(sql`
    DROP INDEX IF EXISTS "subjects_abbreviation_idx";
  `)

  // Drop the old code index if it exists
  await db.execute(sql`
    DROP INDEX IF EXISTS "subjects_code_idx";
  `)

  // Create new tag index
  await db.execute(sql`
    CREATE UNIQUE INDEX "subjects_tag_idx" ON "subjects" USING btree ("tag");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Recreate the code column
  await db.execute(sql`
    ALTER TABLE "subjects" ADD COLUMN "code" varchar;
  `)

  // Rename tag column back to abbreviation
  await db.execute(sql`
    ALTER TABLE "subjects" RENAME COLUMN "tag" TO "abbreviation";
  `)

  // Drop the tag index
  await db.execute(sql`
    DROP INDEX IF EXISTS "subjects_tag_idx";
  `)

  // Recreate the old indexes
  await db.execute(sql`
    CREATE UNIQUE INDEX "subjects_abbreviation_idx" ON "subjects" USING btree ("abbreviation");
  `)

  await db.execute(sql`
    CREATE UNIQUE INDEX "subjects_code_idx" ON "subjects" USING btree ("code");
  `)
}
