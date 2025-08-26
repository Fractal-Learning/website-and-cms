import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_concept_common_core_state_standards_alignment_strength" AS ENUM('strong', 'moderate', 'weak');
  CREATE TABLE "concept_common_core_state_standards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"concept_id" integer NOT NULL,
  	"common_core_standard_id" integer NOT NULL,
  	"notes" varchar,
  	"alignment_strength" "enum_concept_common_core_state_standards_alignment_strength" DEFAULT 'strong',
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "concept_common_core_state_standards_id" integer;
  ALTER TABLE "concept_common_core_state_standards" ADD CONSTRAINT "concept_common_core_state_standards_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "concept_common_core_state_standards" ADD CONSTRAINT "concept_common_core_state_standards_common_core_standard_id_common_core_state_standards_id_fk" FOREIGN KEY ("common_core_standard_id") REFERENCES "public"."common_core_state_standards"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "concept_common_core_state_standards_concept_idx" ON "concept_common_core_state_standards" USING btree ("concept_id");
  CREATE INDEX "concept_common_core_state_standards_common_core_standard_idx" ON "concept_common_core_state_standards" USING btree ("common_core_standard_id");
  CREATE INDEX "concept_common_core_state_standards_updated_at_idx" ON "concept_common_core_state_standards" USING btree ("updated_at");
  CREATE INDEX "concept_common_core_state_standards_created_at_idx" ON "concept_common_core_state_standards" USING btree ("created_at");
  CREATE UNIQUE INDEX "concept_common_core_standard_idx" ON "concept_common_core_state_standards" USING btree ("concept_id","common_core_standard_id");
  CREATE INDEX "concept_idx" ON "concept_common_core_state_standards" USING btree ("concept_id");
  CREATE INDEX "common_core_standard_idx" ON "concept_common_core_state_standards" USING btree ("common_core_standard_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_concept_common_core_state_standards_fk" FOREIGN KEY ("concept_common_core_state_standards_id") REFERENCES "public"."concept_common_core_state_standards"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_concept_common_core_state_standards_id_idx" ON "payload_locked_documents_rels" USING btree ("concept_common_core_state_standards_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "concept_common_core_state_standards" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "concept_common_core_state_standards" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_concept_common_core_state_standards_fk";
  
  DROP INDEX "payload_locked_documents_rels_concept_common_core_state_standards_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "concept_common_core_state_standards_id";
  DROP TYPE "public"."enum_concept_common_core_state_standards_alignment_strength";`)
}
