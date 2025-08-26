import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "grades" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"level" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"sort_order" numeric NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subjects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"abbreviation" varchar NOT NULL,
  	"code" varchar,
  	"description" varchar,
  	"display_color" varchar,
  	"sort_order" numeric,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "standard_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"abbreviation" varchar NOT NULL,
  	"subject_id" integer NOT NULL,
  	"description" varchar,
  	"sort_order" numeric,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "grades_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "subjects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "standard_types_id" integer;
  ALTER TABLE "standard_types" ADD CONSTRAINT "standard_types_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "grades_level_idx" ON "grades" USING btree ("level");
  CREATE INDEX "grades_updated_at_idx" ON "grades" USING btree ("updated_at");
  CREATE INDEX "grades_created_at_idx" ON "grades" USING btree ("created_at");
  CREATE UNIQUE INDEX "subjects_name_idx" ON "subjects" USING btree ("name");
  CREATE UNIQUE INDEX "subjects_abbreviation_idx" ON "subjects" USING btree ("abbreviation");
  CREATE UNIQUE INDEX "subjects_code_idx" ON "subjects" USING btree ("code");
  CREATE INDEX "subjects_updated_at_idx" ON "subjects" USING btree ("updated_at");
  CREATE INDEX "subjects_created_at_idx" ON "subjects" USING btree ("created_at");
  CREATE INDEX "standard_types_subject_idx" ON "standard_types" USING btree ("subject_id");
  CREATE INDEX "standard_types_updated_at_idx" ON "standard_types" USING btree ("updated_at");
  CREATE INDEX "standard_types_created_at_idx" ON "standard_types" USING btree ("created_at");
  CREATE UNIQUE INDEX "subject_abbreviation_idx" ON "standard_types" USING btree ("subject_id","abbreviation");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_grades_fk" FOREIGN KEY ("grades_id") REFERENCES "public"."grades"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subjects_fk" FOREIGN KEY ("subjects_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_standard_types_fk" FOREIGN KEY ("standard_types_id") REFERENCES "public"."standard_types"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_grades_id_idx" ON "payload_locked_documents_rels" USING btree ("grades_id");
  CREATE INDEX "payload_locked_documents_rels_subjects_id_idx" ON "payload_locked_documents_rels" USING btree ("subjects_id");
  CREATE INDEX "payload_locked_documents_rels_standard_types_id_idx" ON "payload_locked_documents_rels" USING btree ("standard_types_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "grades" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "subjects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "standard_types" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "grades" CASCADE;
  DROP TABLE "subjects" CASCADE;
  DROP TABLE "standard_types" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_grades_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_subjects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_standard_types_fk";
  
  DROP INDEX "payload_locked_documents_rels_grades_id_idx";
  DROP INDEX "payload_locked_documents_rels_subjects_id_idx";
  DROP INDEX "payload_locked_documents_rels_standard_types_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "grades_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "subjects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "standard_types_id";`)
}
