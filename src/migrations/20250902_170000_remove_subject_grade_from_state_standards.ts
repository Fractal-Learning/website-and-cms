import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Drop the subject and grade columns from state_standards table
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "state_standards" DROP COLUMN IF EXISTS "subject_id";
    ALTER TABLE "state_standards" DROP COLUMN IF EXISTS "grade_id";
  `)

  // Drop any indexes that might reference these columns
  await payload.db.drizzle.execute(sql`
    DROP INDEX IF EXISTS "state_standards_subject_idx";
    DROP INDEX IF EXISTS "state_standards_grade_idx";
    DROP INDEX IF EXISTS "state_standards_subject_grade_idx";
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Re-add the subject and grade columns
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "state_standards" ADD COLUMN "subject_id" integer;
    ALTER TABLE "state_standards" ADD COLUMN "grade_id" integer;
  `)

  // Re-add foreign key constraints
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "state_standards" ADD CONSTRAINT "state_standards_subject_id_subjects_id_fk" 
    FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE set null ON UPDATE no action;
    
    ALTER TABLE "state_standards" ADD CONSTRAINT "state_standards_grade_id_grades_id_fk" 
    FOREIGN KEY ("grade_id") REFERENCES "public"."grades"("id") ON DELETE set null ON UPDATE no action;
  `)

  // Re-create indexes
  await payload.db.drizzle.execute(sql`
    CREATE INDEX "state_standards_subject_idx" ON "state_standards" USING btree ("subject_id");
    CREATE INDEX "state_standards_grade_idx" ON "state_standards" USING btree ("grade_id");
  `)
}
