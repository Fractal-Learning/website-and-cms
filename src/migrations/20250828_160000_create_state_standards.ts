import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-vercel-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Create the state_standards table
  await payload.db.drizzle.execute(`
    CREATE TABLE IF NOT EXISTS "state_standards" (
      "id" SERIAL PRIMARY KEY,
      "state_code" VARCHAR(2) NOT NULL,
      "state_name" TEXT NOT NULL,
      "subject" INTEGER NOT NULL,
      "grade" INTEGER NOT NULL,
      "common_core_state_standard" INTEGER NOT NULL,
      "statement" TEXT NOT NULL,
      "metadata" JSONB,
      "active" BOOLEAN DEFAULT true,
      "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `)

  // Create indexes for efficient querying
  await payload.db.drizzle.execute(`
    CREATE INDEX IF NOT EXISTS "state_standards_state_subject_grade_idx" 
    ON "state_standards" ("state_code", "subject", "grade");
  `)

  await payload.db.drizzle.execute(`
    CREATE INDEX IF NOT EXISTS "state_standards_common_core_idx" 
    ON "state_standards" ("common_core_state_standard");
  `)

  await payload.db.drizzle.execute(`
    CREATE INDEX IF NOT EXISTS "state_standards_state_code_idx" 
    ON "state_standards" ("state_code");
  `)

  // Add foreign key constraints
  await payload.db.drizzle.execute(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'state_standards_subject_fk'
      ) THEN
        ALTER TABLE "state_standards" 
        ADD CONSTRAINT "state_standards_subject_fk" 
        FOREIGN KEY ("subject") REFERENCES "subjects"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  await payload.db.drizzle.execute(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'state_standards_grade_fk'
      ) THEN
        ALTER TABLE "state_standards" 
        ADD CONSTRAINT "state_standards_grade_fk" 
        FOREIGN KEY ("grade") REFERENCES "grades"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  await payload.db.drizzle.execute(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'state_standards_common_core_fk'
      ) THEN
        ALTER TABLE "state_standards" 
        ADD CONSTRAINT "state_standards_common_core_fk" 
        FOREIGN KEY ("common_core_state_standard") REFERENCES "common_core_state_standards"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Drop the state_standards table
  await payload.db.drizzle.execute(`
    DROP TABLE IF EXISTS "state_standards";
  `)
}
