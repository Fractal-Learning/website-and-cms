import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_learning_outcomes_assessment_type" AS ENUM('formative', 'summative', 'diagnostic', 'benchmark');
  CREATE TYPE "public"."enum_learning_outcomes_difficulty_level" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TABLE "concepts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"overview" jsonb NOT NULL,
  	"active" boolean DEFAULT true,
  	"metadata" jsonb,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "concepts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"subjects_id" integer
  );
  
  CREATE TABLE "common_core_state_standards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"statement" jsonb NOT NULL,
  	"subject_id" integer NOT NULL,
  	"grade_id" integer NOT NULL,
  	"standard_type_id" integer NOT NULL,
  	"domain" varchar,
  	"metadata" jsonb,
  	"active" boolean DEFAULT true,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "learning_outcomes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"statement" jsonb NOT NULL,
  	"concept_id" integer NOT NULL,
  	"success_criteria" jsonb,
  	"assessment_type" "enum_learning_outcomes_assessment_type" DEFAULT 'formative' NOT NULL,
  	"sort" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"estimated_duration_minutes" numeric,
  	"difficulty_level" "enum_learning_outcomes_difficulty_level",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "concepts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "common_core_state_standards_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "learning_outcomes_id" integer;
  ALTER TABLE "concepts_rels" ADD CONSTRAINT "concepts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "concepts_rels" ADD CONSTRAINT "concepts_rels_subjects_fk" FOREIGN KEY ("subjects_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "common_core_state_standards" ADD CONSTRAINT "common_core_state_standards_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "common_core_state_standards" ADD CONSTRAINT "common_core_state_standards_grade_id_grades_id_fk" FOREIGN KEY ("grade_id") REFERENCES "public"."grades"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "common_core_state_standards" ADD CONSTRAINT "common_core_state_standards_standard_type_id_standard_types_id_fk" FOREIGN KEY ("standard_type_id") REFERENCES "public"."standard_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "learning_outcomes" ADD CONSTRAINT "learning_outcomes_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "concepts_slug_idx" ON "concepts" USING btree ("slug");
  CREATE INDEX "concepts_updated_at_idx" ON "concepts" USING btree ("updated_at");
  CREATE INDEX "concepts_created_at_idx" ON "concepts" USING btree ("created_at");
  CREATE INDEX "concepts_rels_order_idx" ON "concepts_rels" USING btree ("order");
  CREATE INDEX "concepts_rels_parent_idx" ON "concepts_rels" USING btree ("parent_id");
  CREATE INDEX "concepts_rels_path_idx" ON "concepts_rels" USING btree ("path");
  CREATE INDEX "concepts_rels_subjects_id_idx" ON "concepts_rels" USING btree ("subjects_id");
  CREATE UNIQUE INDEX "common_core_state_standards_code_idx" ON "common_core_state_standards" USING btree ("code");
  CREATE INDEX "common_core_state_standards_subject_idx" ON "common_core_state_standards" USING btree ("subject_id");
  CREATE INDEX "common_core_state_standards_grade_idx" ON "common_core_state_standards" USING btree ("grade_id");
  CREATE INDEX "common_core_state_standards_standard_type_idx" ON "common_core_state_standards" USING btree ("standard_type_id");
  CREATE INDEX "common_core_state_standards_updated_at_idx" ON "common_core_state_standards" USING btree ("updated_at");
  CREATE INDEX "common_core_state_standards_created_at_idx" ON "common_core_state_standards" USING btree ("created_at");
  CREATE INDEX "subject_grade_standard_type_idx" ON "common_core_state_standards" USING btree ("subject_id","grade_id","standard_type_id");
  CREATE UNIQUE INDEX "code_idx" ON "common_core_state_standards" USING btree ("code");
  CREATE INDEX "learning_outcomes_concept_idx" ON "learning_outcomes" USING btree ("concept_id");
  CREATE INDEX "learning_outcomes_updated_at_idx" ON "learning_outcomes" USING btree ("updated_at");
  CREATE INDEX "learning_outcomes_created_at_idx" ON "learning_outcomes" USING btree ("created_at");
  CREATE INDEX "concept_sort_idx" ON "learning_outcomes" USING btree ("concept_id","sort");
  CREATE INDEX "assessment_type_idx" ON "learning_outcomes" USING btree ("assessment_type");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_concepts_fk" FOREIGN KEY ("concepts_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_common_core_state_standards_fk" FOREIGN KEY ("common_core_state_standards_id") REFERENCES "public"."common_core_state_standards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_learning_outcomes_fk" FOREIGN KEY ("learning_outcomes_id") REFERENCES "public"."learning_outcomes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_concepts_id_idx" ON "payload_locked_documents_rels" USING btree ("concepts_id");
  CREATE INDEX "payload_locked_documents_rels_common_core_state_standards_id_idx" ON "payload_locked_documents_rels" USING btree ("common_core_state_standards_id");
  CREATE INDEX "payload_locked_documents_rels_learning_outcomes_id_idx" ON "payload_locked_documents_rels" USING btree ("learning_outcomes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "concepts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "concepts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "common_core_state_standards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "learning_outcomes" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "concepts" CASCADE;
  DROP TABLE "concepts_rels" CASCADE;
  DROP TABLE "common_core_state_standards" CASCADE;
  DROP TABLE "learning_outcomes" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_concepts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_common_core_state_standards_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_learning_outcomes_fk";
  
  DROP INDEX "payload_locked_documents_rels_concepts_id_idx";
  DROP INDEX "payload_locked_documents_rels_common_core_state_standards_id_idx";
  DROP INDEX "payload_locked_documents_rels_learning_outcomes_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "concepts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "common_core_state_standards_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "learning_outcomes_id";
  DROP TYPE "public"."enum_learning_outcomes_assessment_type";
  DROP TYPE "public"."enum_learning_outcomes_difficulty_level";`)
}
