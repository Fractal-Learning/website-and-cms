import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_skill_universal_questions_question_type" AS ENUM('open_ended', 'reflective', 'analytical', 'evaluative', 'creative');
  CREATE TYPE "public"."enum_concept_universal_questions_question_type" AS ENUM('open_ended', 'reflective', 'analytical', 'evaluative', 'creative');
  CREATE TYPE "public"."enum_strategies_strategy_type" AS ENUM('individual', 'pair', 'small_group', 'whole_class', 'independent');
  CREATE TYPE "public"."enum_strategies_difficulty_level" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_kid_translations_grade_level" AS ENUM('k_2', '3_5', '6_8', '9_12');
  CREATE TYPE "public"."enum_kid_translations_reading_level" AS ENUM('pre_k', 'k', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
  CREATE TABLE "subjects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"tag" varchar NOT NULL,
  	"description" varchar,
  	"sort_order" numeric,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "standard_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"tag" varchar NOT NULL,
  	"subject_id" integer NOT NULL,
  	"description" varchar,
  	"display_color" varchar,
  	"sort_order" numeric,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "grades" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"level" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"sort_order" numeric NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "common_core_codes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code_name" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "common_core_state_standards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code_id" integer NOT NULL,
  	"statement" jsonb NOT NULL,
  	"subject_id" integer NOT NULL,
  	"grade_id" integer NOT NULL,
  	"standard_type_id" integer NOT NULL,
  	"metadata" jsonb,
  	"active" boolean DEFAULT true,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  	"subjects_id" integer,
  	"common_core_state_standards_id" integer
  );
  
  CREATE TABLE "learning_outcomes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"statement" jsonb NOT NULL,
  	"concept_id" integer NOT NULL,
  	"sort" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "essential_questions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"learning_outcome_id" integer NOT NULL,
  	"sort" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "skills" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"concept_id" integer NOT NULL,
  	"big_idea" jsonb NOT NULL,
  	"sort" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "skill_universal_questions_suggested_followups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"followup_question" varchar NOT NULL
  );
  
  CREATE TABLE "skill_universal_questions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"skill_id" integer NOT NULL,
  	"sort" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"question_type" "enum_skill_universal_questions_question_type" DEFAULT 'open_ended',
  	"context" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "concept_universal_questions_suggested_followups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"followup_question" varchar NOT NULL
  );
  
  CREATE TABLE "concept_universal_questions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"concept_id" integer NOT NULL,
  	"sort" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"question_type" "enum_concept_universal_questions_question_type" DEFAULT 'open_ended',
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
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "subjects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "standard_types_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "grades_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "common_core_codes_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "common_core_state_standards_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "concepts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "learning_outcomes_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "essential_questions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "skills_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "skill_universal_questions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "concept_universal_questions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "strategies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "kid_translations_id" integer;
  ALTER TABLE "standard_types" ADD CONSTRAINT "standard_types_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "common_core_state_standards" ADD CONSTRAINT "common_core_state_standards_code_id_common_core_codes_id_fk" FOREIGN KEY ("code_id") REFERENCES "public"."common_core_codes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "common_core_state_standards" ADD CONSTRAINT "common_core_state_standards_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "common_core_state_standards" ADD CONSTRAINT "common_core_state_standards_grade_id_grades_id_fk" FOREIGN KEY ("grade_id") REFERENCES "public"."grades"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "common_core_state_standards" ADD CONSTRAINT "common_core_state_standards_standard_type_id_standard_types_id_fk" FOREIGN KEY ("standard_type_id") REFERENCES "public"."standard_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "concepts_rels" ADD CONSTRAINT "concepts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "concepts_rels" ADD CONSTRAINT "concepts_rels_subjects_fk" FOREIGN KEY ("subjects_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "concepts_rels" ADD CONSTRAINT "concepts_rels_common_core_state_standards_fk" FOREIGN KEY ("common_core_state_standards_id") REFERENCES "public"."common_core_state_standards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learning_outcomes" ADD CONSTRAINT "learning_outcomes_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "essential_questions" ADD CONSTRAINT "essential_questions_learning_outcome_id_learning_outcomes_id_fk" FOREIGN KEY ("learning_outcome_id") REFERENCES "public"."learning_outcomes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "skills" ADD CONSTRAINT "skills_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "skill_universal_questions_suggested_followups" ADD CONSTRAINT "skill_universal_questions_suggested_followups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."skill_universal_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "skill_universal_questions" ADD CONSTRAINT "skill_universal_questions_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "concept_universal_questions_suggested_followups" ADD CONSTRAINT "concept_universal_questions_suggested_followups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."concept_universal_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "concept_universal_questions" ADD CONSTRAINT "concept_universal_questions_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "strategies_materials_needed" ADD CONSTRAINT "strategies_materials_needed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."strategies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "strategies" ADD CONSTRAINT "strategies_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "kid_translations_vocabulary_support" ADD CONSTRAINT "kid_translations_vocabulary_support_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kid_translations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kid_translations_examples" ADD CONSTRAINT "kid_translations_examples_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kid_translations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kid_translations" ADD CONSTRAINT "kid_translations_strategy_id_strategies_id_fk" FOREIGN KEY ("strategy_id") REFERENCES "public"."strategies"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "subjects_name_idx" ON "subjects" USING btree ("name");
  CREATE UNIQUE INDEX "subjects_tag_idx" ON "subjects" USING btree ("tag");
  CREATE INDEX "subjects_updated_at_idx" ON "subjects" USING btree ("updated_at");
  CREATE INDEX "subjects_created_at_idx" ON "subjects" USING btree ("created_at");
  CREATE INDEX "standard_types_subject_idx" ON "standard_types" USING btree ("subject_id");
  CREATE INDEX "standard_types_updated_at_idx" ON "standard_types" USING btree ("updated_at");
  CREATE INDEX "standard_types_created_at_idx" ON "standard_types" USING btree ("created_at");
  CREATE UNIQUE INDEX "subject_tag_idx" ON "standard_types" USING btree ("subject_id","tag");
  CREATE UNIQUE INDEX "grades_level_idx" ON "grades" USING btree ("level");
  CREATE INDEX "grades_updated_at_idx" ON "grades" USING btree ("updated_at");
  CREATE INDEX "grades_created_at_idx" ON "grades" USING btree ("created_at");
  CREATE UNIQUE INDEX "common_core_codes_code_name_idx" ON "common_core_codes" USING btree ("code_name");
  CREATE INDEX "common_core_codes_updated_at_idx" ON "common_core_codes" USING btree ("updated_at");
  CREATE INDEX "common_core_codes_created_at_idx" ON "common_core_codes" USING btree ("created_at");
  CREATE UNIQUE INDEX "code_name_idx" ON "common_core_codes" USING btree ("code_name");
  CREATE UNIQUE INDEX "common_core_state_standards_code_idx" ON "common_core_state_standards" USING btree ("code_id");
  CREATE INDEX "common_core_state_standards_subject_idx" ON "common_core_state_standards" USING btree ("subject_id");
  CREATE INDEX "common_core_state_standards_grade_idx" ON "common_core_state_standards" USING btree ("grade_id");
  CREATE INDEX "common_core_state_standards_standard_type_idx" ON "common_core_state_standards" USING btree ("standard_type_id");
  CREATE INDEX "common_core_state_standards_updated_at_idx" ON "common_core_state_standards" USING btree ("updated_at");
  CREATE INDEX "common_core_state_standards_created_at_idx" ON "common_core_state_standards" USING btree ("created_at");
  CREATE INDEX "subject_grade_standard_type_idx" ON "common_core_state_standards" USING btree ("subject_id","grade_id","standard_type_id");
  CREATE UNIQUE INDEX "code_idx" ON "common_core_state_standards" USING btree ("code_id");
  CREATE INDEX "concepts_slug_idx" ON "concepts" USING btree ("slug");
  CREATE INDEX "concepts_updated_at_idx" ON "concepts" USING btree ("updated_at");
  CREATE INDEX "concepts_created_at_idx" ON "concepts" USING btree ("created_at");
  CREATE INDEX "concepts_rels_order_idx" ON "concepts_rels" USING btree ("order");
  CREATE INDEX "concepts_rels_parent_idx" ON "concepts_rels" USING btree ("parent_id");
  CREATE INDEX "concepts_rels_path_idx" ON "concepts_rels" USING btree ("path");
  CREATE INDEX "concepts_rels_subjects_id_idx" ON "concepts_rels" USING btree ("subjects_id");
  CREATE INDEX "concepts_rels_common_core_state_standards_id_idx" ON "concepts_rels" USING btree ("common_core_state_standards_id");
  CREATE INDEX "learning_outcomes_concept_idx" ON "learning_outcomes" USING btree ("concept_id");
  CREATE INDEX "learning_outcomes_updated_at_idx" ON "learning_outcomes" USING btree ("updated_at");
  CREATE INDEX "learning_outcomes_created_at_idx" ON "learning_outcomes" USING btree ("created_at");
  CREATE INDEX "concept_sort_idx" ON "learning_outcomes" USING btree ("concept_id","sort");
  CREATE UNIQUE INDEX "essential_questions_learning_outcome_idx" ON "essential_questions" USING btree ("learning_outcome_id");
  CREATE INDEX "essential_questions_updated_at_idx" ON "essential_questions" USING btree ("updated_at");
  CREATE INDEX "essential_questions_created_at_idx" ON "essential_questions" USING btree ("created_at");
  CREATE UNIQUE INDEX "learning_outcome_idx" ON "essential_questions" USING btree ("learning_outcome_id");
  CREATE INDEX "sort_idx" ON "essential_questions" USING btree ("sort");
  CREATE INDEX "skills_concept_idx" ON "skills" USING btree ("concept_id");
  CREATE INDEX "skills_updated_at_idx" ON "skills" USING btree ("updated_at");
  CREATE INDEX "skills_created_at_idx" ON "skills" USING btree ("created_at");
  CREATE INDEX "concept_sort_1_idx" ON "skills" USING btree ("concept_id","sort");
  CREATE INDEX "skill_universal_questions_suggested_followups_order_idx" ON "skill_universal_questions_suggested_followups" USING btree ("_order");
  CREATE INDEX "skill_universal_questions_suggested_followups_parent_id_idx" ON "skill_universal_questions_suggested_followups" USING btree ("_parent_id");
  CREATE INDEX "skill_universal_questions_skill_idx" ON "skill_universal_questions" USING btree ("skill_id");
  CREATE INDEX "skill_universal_questions_updated_at_idx" ON "skill_universal_questions" USING btree ("updated_at");
  CREATE INDEX "skill_universal_questions_created_at_idx" ON "skill_universal_questions" USING btree ("created_at");
  CREATE INDEX "skill_sort_idx" ON "skill_universal_questions" USING btree ("skill_id","sort");
  CREATE INDEX "question_type_idx" ON "skill_universal_questions" USING btree ("question_type");
  CREATE INDEX "concept_universal_questions_suggested_followups_order_idx" ON "concept_universal_questions_suggested_followups" USING btree ("_order");
  CREATE INDEX "concept_universal_questions_suggested_followups_parent_id_idx" ON "concept_universal_questions_suggested_followups" USING btree ("_parent_id");
  CREATE INDEX "concept_universal_questions_concept_idx" ON "concept_universal_questions" USING btree ("concept_id");
  CREATE INDEX "concept_universal_questions_updated_at_idx" ON "concept_universal_questions" USING btree ("updated_at");
  CREATE INDEX "concept_universal_questions_created_at_idx" ON "concept_universal_questions" USING btree ("created_at");
  CREATE INDEX "concept_sort_2_idx" ON "concept_universal_questions" USING btree ("concept_id","sort");
  CREATE INDEX "question_type_1_idx" ON "concept_universal_questions" USING btree ("question_type");
  CREATE INDEX "strategies_materials_needed_order_idx" ON "strategies_materials_needed" USING btree ("_order");
  CREATE INDEX "strategies_materials_needed_parent_id_idx" ON "strategies_materials_needed" USING btree ("_parent_id");
  CREATE INDEX "strategies_skill_idx" ON "strategies" USING btree ("skill_id");
  CREATE INDEX "strategies_updated_at_idx" ON "strategies" USING btree ("updated_at");
  CREATE INDEX "strategies_created_at_idx" ON "strategies" USING btree ("created_at");
  CREATE INDEX "skill_sort_1_idx" ON "strategies" USING btree ("skill_id","sort");
  CREATE INDEX "strategy_type_idx" ON "strategies" USING btree ("strategy_type");
  CREATE INDEX "difficulty_level_idx" ON "strategies" USING btree ("difficulty_level");
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
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subjects_fk" FOREIGN KEY ("subjects_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_standard_types_fk" FOREIGN KEY ("standard_types_id") REFERENCES "public"."standard_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_grades_fk" FOREIGN KEY ("grades_id") REFERENCES "public"."grades"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_common_core_codes_fk" FOREIGN KEY ("common_core_codes_id") REFERENCES "public"."common_core_codes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_common_core_state_standards_fk" FOREIGN KEY ("common_core_state_standards_id") REFERENCES "public"."common_core_state_standards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_concepts_fk" FOREIGN KEY ("concepts_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_learning_outcomes_fk" FOREIGN KEY ("learning_outcomes_id") REFERENCES "public"."learning_outcomes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_essential_questions_fk" FOREIGN KEY ("essential_questions_id") REFERENCES "public"."essential_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_skills_fk" FOREIGN KEY ("skills_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_skill_universal_questions_fk" FOREIGN KEY ("skill_universal_questions_id") REFERENCES "public"."skill_universal_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_concept_universal_questions_fk" FOREIGN KEY ("concept_universal_questions_id") REFERENCES "public"."concept_universal_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_strategies_fk" FOREIGN KEY ("strategies_id") REFERENCES "public"."strategies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_kid_translations_fk" FOREIGN KEY ("kid_translations_id") REFERENCES "public"."kid_translations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_subjects_id_idx" ON "payload_locked_documents_rels" USING btree ("subjects_id");
  CREATE INDEX "payload_locked_documents_rels_standard_types_id_idx" ON "payload_locked_documents_rels" USING btree ("standard_types_id");
  CREATE INDEX "payload_locked_documents_rels_grades_id_idx" ON "payload_locked_documents_rels" USING btree ("grades_id");
  CREATE INDEX "payload_locked_documents_rels_common_core_codes_id_idx" ON "payload_locked_documents_rels" USING btree ("common_core_codes_id");
  CREATE INDEX "payload_locked_documents_rels_common_core_state_standards_id_idx" ON "payload_locked_documents_rels" USING btree ("common_core_state_standards_id");
  CREATE INDEX "payload_locked_documents_rels_concepts_id_idx" ON "payload_locked_documents_rels" USING btree ("concepts_id");
  CREATE INDEX "payload_locked_documents_rels_learning_outcomes_id_idx" ON "payload_locked_documents_rels" USING btree ("learning_outcomes_id");
  CREATE INDEX "payload_locked_documents_rels_essential_questions_id_idx" ON "payload_locked_documents_rels" USING btree ("essential_questions_id");
  CREATE INDEX "payload_locked_documents_rels_skills_id_idx" ON "payload_locked_documents_rels" USING btree ("skills_id");
  CREATE INDEX "payload_locked_documents_rels_skill_universal_questions_id_idx" ON "payload_locked_documents_rels" USING btree ("skill_universal_questions_id");
  CREATE INDEX "payload_locked_documents_rels_concept_universal_questions_id_idx" ON "payload_locked_documents_rels" USING btree ("concept_universal_questions_id");
  CREATE INDEX "payload_locked_documents_rels_strategies_id_idx" ON "payload_locked_documents_rels" USING btree ("strategies_id");
  CREATE INDEX "payload_locked_documents_rels_kid_translations_id_idx" ON "payload_locked_documents_rels" USING btree ("kid_translations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "subjects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "standard_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "grades" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "common_core_codes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "common_core_state_standards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "concepts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "concepts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "learning_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "essential_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "skills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "skill_universal_questions_suggested_followups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "skill_universal_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "concept_universal_questions_suggested_followups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "concept_universal_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "strategies_materials_needed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "strategies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "kid_translations_vocabulary_support" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "kid_translations_examples" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "kid_translations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "subjects" CASCADE;
  DROP TABLE "standard_types" CASCADE;
  DROP TABLE "grades" CASCADE;
  DROP TABLE "common_core_codes" CASCADE;
  DROP TABLE "common_core_state_standards" CASCADE;
  DROP TABLE "concepts" CASCADE;
  DROP TABLE "concepts_rels" CASCADE;
  DROP TABLE "learning_outcomes" CASCADE;
  DROP TABLE "essential_questions" CASCADE;
  DROP TABLE "skills" CASCADE;
  DROP TABLE "skill_universal_questions_suggested_followups" CASCADE;
  DROP TABLE "skill_universal_questions" CASCADE;
  DROP TABLE "concept_universal_questions_suggested_followups" CASCADE;
  DROP TABLE "concept_universal_questions" CASCADE;
  DROP TABLE "strategies_materials_needed" CASCADE;
  DROP TABLE "strategies" CASCADE;
  DROP TABLE "kid_translations_vocabulary_support" CASCADE;
  DROP TABLE "kid_translations_examples" CASCADE;
  DROP TABLE "kid_translations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_subjects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_standard_types_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_grades_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_common_core_codes_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_common_core_state_standards_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_concepts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_learning_outcomes_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_essential_questions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_skills_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_skill_universal_questions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_concept_universal_questions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_strategies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_kid_translations_fk";
  
  DROP INDEX "payload_locked_documents_rels_subjects_id_idx";
  DROP INDEX "payload_locked_documents_rels_standard_types_id_idx";
  DROP INDEX "payload_locked_documents_rels_grades_id_idx";
  DROP INDEX "payload_locked_documents_rels_common_core_codes_id_idx";
  DROP INDEX "payload_locked_documents_rels_common_core_state_standards_id_idx";
  DROP INDEX "payload_locked_documents_rels_concepts_id_idx";
  DROP INDEX "payload_locked_documents_rels_learning_outcomes_id_idx";
  DROP INDEX "payload_locked_documents_rels_essential_questions_id_idx";
  DROP INDEX "payload_locked_documents_rels_skills_id_idx";
  DROP INDEX "payload_locked_documents_rels_skill_universal_questions_id_idx";
  DROP INDEX "payload_locked_documents_rels_concept_universal_questions_id_idx";
  DROP INDEX "payload_locked_documents_rels_strategies_id_idx";
  DROP INDEX "payload_locked_documents_rels_kid_translations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "subjects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "standard_types_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "grades_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "common_core_codes_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "common_core_state_standards_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "concepts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "learning_outcomes_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "essential_questions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "skills_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "skill_universal_questions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "concept_universal_questions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "strategies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "kid_translations_id";
  DROP TYPE "public"."enum_skill_universal_questions_question_type";
  DROP TYPE "public"."enum_concept_universal_questions_question_type";
  DROP TYPE "public"."enum_strategies_strategy_type";
  DROP TYPE "public"."enum_strategies_difficulty_level";
  DROP TYPE "public"."enum_kid_translations_grade_level";
  DROP TYPE "public"."enum_kid_translations_reading_level";`)
}
