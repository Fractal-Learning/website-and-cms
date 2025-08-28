import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_skills_difficulty_level" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');
  CREATE TYPE "public"."enum_universal_questions_question_type" AS ENUM('open_ended', 'reflective', 'analytical', 'evaluative', 'creative');
  CREATE TYPE "public"."enum_strategies_strategy_type" AS ENUM('individual', 'pair', 'small_group', 'whole_class', 'independent');
  CREATE TYPE "public"."enum_strategies_difficulty_level" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_kid_translations_grade_level" AS ENUM('k_2', '3_5', '6_8', '9_12');
  CREATE TYPE "public"."enum_kid_translations_reading_level" AS ENUM('pre_k', 'k', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
  CREATE TABLE "essential_questions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"learning_outcome_id" integer NOT NULL,
  	"sort" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"context" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "skills" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"essential_question_id" integer NOT NULL,
  	"big_idea" jsonb NOT NULL,
  	"sort" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"difficulty_level" "enum_skills_difficulty_level" DEFAULT 'beginner',
  	"estimated_hours" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "skills_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"skills_id" integer
  );
  
  CREATE TABLE "universal_questions_suggested_followups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"followup_question" varchar NOT NULL
  );
  
  CREATE TABLE "universal_questions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"skill_id" integer NOT NULL,
  	"sort" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"question_type" "enum_universal_questions_question_type" DEFAULT 'open_ended',
  	"context" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "strategies_materials_needed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"material" varchar NOT NULL
  );
  
  CREATE TABLE "strategies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"skill_id" integer NOT NULL,
  	"description" jsonb NOT NULL,
  	"estimated_minutes" numeric NOT NULL,
  	"sort" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"strategy_type" "enum_strategies_strategy_type" DEFAULT 'individual',
  	"difficulty_level" "enum_strategies_difficulty_level" DEFAULT 'beginner',
  	"instructions" jsonb,
  	"assessment_method" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "kid_translations_vocabulary_support" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"term" varchar NOT NULL,
  	"definition" varchar NOT NULL
  );
  
  CREATE TABLE "kid_translations_examples" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"example" varchar NOT NULL
  );
  
  CREATE TABLE "kid_translations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"strategy_id" integer NOT NULL,
  	"translation" jsonb NOT NULL,
  	"grade_level" "enum_kid_translations_grade_level" DEFAULT 'k_2',
  	"active" boolean DEFAULT true,
  	"motivational_message" varchar,
  	"success_criteria_kid_friendly" jsonb,
  	"reading_level" "enum_kid_translations_reading_level",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "essential_questions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "skills_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "universal_questions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "strategies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "kid_translations_id" integer;
  ALTER TABLE "essential_questions" ADD CONSTRAINT "essential_questions_learning_outcome_id_learning_outcomes_id_fk" FOREIGN KEY ("learning_outcome_id") REFERENCES "public"."learning_outcomes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "skills" ADD CONSTRAINT "skills_essential_question_id_essential_questions_id_fk" FOREIGN KEY ("essential_question_id") REFERENCES "public"."essential_questions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "skills_rels" ADD CONSTRAINT "skills_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "skills_rels" ADD CONSTRAINT "skills_rels_skills_fk" FOREIGN KEY ("skills_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "universal_questions_suggested_followups" ADD CONSTRAINT "universal_questions_suggested_followups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."universal_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "universal_questions" ADD CONSTRAINT "universal_questions_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "strategies_materials_needed" ADD CONSTRAINT "strategies_materials_needed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."strategies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "strategies" ADD CONSTRAINT "strategies_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "kid_translations_vocabulary_support" ADD CONSTRAINT "kid_translations_vocabulary_support_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kid_translations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kid_translations_examples" ADD CONSTRAINT "kid_translations_examples_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kid_translations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kid_translations" ADD CONSTRAINT "kid_translations_strategy_id_strategies_id_fk" FOREIGN KEY ("strategy_id") REFERENCES "public"."strategies"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "essential_questions_learning_outcome_idx" ON "essential_questions" USING btree ("learning_outcome_id");
  CREATE INDEX "essential_questions_updated_at_idx" ON "essential_questions" USING btree ("updated_at");
  CREATE INDEX "essential_questions_created_at_idx" ON "essential_questions" USING btree ("created_at");
  CREATE UNIQUE INDEX "learning_outcome_idx" ON "essential_questions" USING btree ("learning_outcome_id");
  CREATE INDEX "sort_idx" ON "essential_questions" USING btree ("sort");
  CREATE UNIQUE INDEX "skills_essential_question_idx" ON "skills" USING btree ("essential_question_id");
  CREATE INDEX "skills_updated_at_idx" ON "skills" USING btree ("updated_at");
  CREATE INDEX "skills_created_at_idx" ON "skills" USING btree ("created_at");
  CREATE UNIQUE INDEX "essential_question_idx" ON "skills" USING btree ("essential_question_id");
  CREATE INDEX "sort_1_idx" ON "skills" USING btree ("sort");
  CREATE INDEX "difficulty_level_idx" ON "skills" USING btree ("difficulty_level");
  CREATE INDEX "skills_rels_order_idx" ON "skills_rels" USING btree ("order");
  CREATE INDEX "skills_rels_parent_idx" ON "skills_rels" USING btree ("parent_id");
  CREATE INDEX "skills_rels_path_idx" ON "skills_rels" USING btree ("path");
  CREATE INDEX "skills_rels_skills_id_idx" ON "skills_rels" USING btree ("skills_id");
  CREATE INDEX "universal_questions_suggested_followups_order_idx" ON "universal_questions_suggested_followups" USING btree ("_order");
  CREATE INDEX "universal_questions_suggested_followups_parent_id_idx" ON "universal_questions_suggested_followups" USING btree ("_parent_id");
  CREATE INDEX "universal_questions_skill_idx" ON "universal_questions" USING btree ("skill_id");
  CREATE INDEX "universal_questions_updated_at_idx" ON "universal_questions" USING btree ("updated_at");
  CREATE INDEX "universal_questions_created_at_idx" ON "universal_questions" USING btree ("created_at");
  CREATE INDEX "skill_sort_idx" ON "universal_questions" USING btree ("skill_id","sort");
  CREATE INDEX "question_type_idx" ON "universal_questions" USING btree ("question_type");
  CREATE INDEX "strategies_materials_needed_order_idx" ON "strategies_materials_needed" USING btree ("_order");
  CREATE INDEX "strategies_materials_needed_parent_id_idx" ON "strategies_materials_needed" USING btree ("_parent_id");
  CREATE INDEX "strategies_skill_idx" ON "strategies" USING btree ("skill_id");
  CREATE INDEX "strategies_updated_at_idx" ON "strategies" USING btree ("updated_at");
  CREATE INDEX "strategies_created_at_idx" ON "strategies" USING btree ("created_at");
  CREATE INDEX "skill_sort_1_idx" ON "strategies" USING btree ("skill_id","sort");
  CREATE INDEX "strategy_type_idx" ON "strategies" USING btree ("strategy_type");
  CREATE INDEX "difficulty_level_1_idx" ON "strategies" USING btree ("difficulty_level");
  CREATE INDEX "estimated_minutes_idx" ON "strategies" USING btree ("estimated_minutes");
  CREATE INDEX "kid_translations_vocabulary_support_order_idx" ON "kid_translations_vocabulary_support" USING btree ("_order");
  CREATE INDEX "kid_translations_vocabulary_support_parent_id_idx" ON "kid_translations_vocabulary_support" USING btree ("_parent_id");
  CREATE INDEX "kid_translations_examples_order_idx" ON "kid_translations_examples" USING btree ("_order");
  CREATE INDEX "kid_translations_examples_parent_id_idx" ON "kid_translations_examples" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "kid_translations_strategy_idx" ON "kid_translations" USING btree ("strategy_id");
  CREATE INDEX "kid_translations_updated_at_idx" ON "kid_translations" USING btree ("updated_at");
  CREATE INDEX "kid_translations_created_at_idx" ON "kid_translations" USING btree ("created_at");
  CREATE UNIQUE INDEX "strategy_idx" ON "kid_translations" USING btree ("strategy_id");
  CREATE INDEX "grade_level_idx" ON "kid_translations" USING btree ("grade_level");
  CREATE INDEX "reading_level_idx" ON "kid_translations" USING btree ("reading_level");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_essential_questions_fk" FOREIGN KEY ("essential_questions_id") REFERENCES "public"."essential_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_skills_fk" FOREIGN KEY ("skills_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_universal_questions_fk" FOREIGN KEY ("universal_questions_id") REFERENCES "public"."universal_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_strategies_fk" FOREIGN KEY ("strategies_id") REFERENCES "public"."strategies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_kid_translations_fk" FOREIGN KEY ("kid_translations_id") REFERENCES "public"."kid_translations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_essential_questions_id_idx" ON "payload_locked_documents_rels" USING btree ("essential_questions_id");
  CREATE INDEX "payload_locked_documents_rels_skills_id_idx" ON "payload_locked_documents_rels" USING btree ("skills_id");
  CREATE INDEX "payload_locked_documents_rels_universal_questions_id_idx" ON "payload_locked_documents_rels" USING btree ("universal_questions_id");
  CREATE INDEX "payload_locked_documents_rels_strategies_id_idx" ON "payload_locked_documents_rels" USING btree ("strategies_id");
  CREATE INDEX "payload_locked_documents_rels_kid_translations_id_idx" ON "payload_locked_documents_rels" USING btree ("kid_translations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "essential_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "skills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "skills_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "universal_questions_suggested_followups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "universal_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "strategies_materials_needed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "strategies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "kid_translations_vocabulary_support" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "kid_translations_examples" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "kid_translations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "essential_questions" CASCADE;
  DROP TABLE "skills" CASCADE;
  DROP TABLE "skills_rels" CASCADE;
  DROP TABLE "universal_questions_suggested_followups" CASCADE;
  DROP TABLE "universal_questions" CASCADE;
  DROP TABLE "strategies_materials_needed" CASCADE;
  DROP TABLE "strategies" CASCADE;
  DROP TABLE "kid_translations_vocabulary_support" CASCADE;
  DROP TABLE "kid_translations_examples" CASCADE;
  DROP TABLE "kid_translations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_essential_questions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_skills_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_universal_questions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_strategies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_kid_translations_fk";
  
  DROP INDEX "payload_locked_documents_rels_essential_questions_id_idx";
  DROP INDEX "payload_locked_documents_rels_skills_id_idx";
  DROP INDEX "payload_locked_documents_rels_universal_questions_id_idx";
  DROP INDEX "payload_locked_documents_rels_strategies_id_idx";
  DROP INDEX "payload_locked_documents_rels_kid_translations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "essential_questions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "skills_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "universal_questions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "strategies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "kid_translations_id";
  DROP TYPE "public"."enum_skills_difficulty_level";
  DROP TYPE "public"."enum_universal_questions_question_type";
  DROP TYPE "public"."enum_strategies_strategy_type";
  DROP TYPE "public"."enum_strategies_difficulty_level";
  DROP TYPE "public"."enum_kid_translations_grade_level";
  DROP TYPE "public"."enum_kid_translations_reading_level";`)
}
