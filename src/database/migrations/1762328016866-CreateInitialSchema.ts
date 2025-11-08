import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialSchema1762328016866 implements MigrationInterface {
    name = 'CreateInitialSchema1762328016866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."proba_templates_gender_variant_enum" AS ENUM('MALE', 'FEMALE', 'NEUTRAL')`);
        await queryRunner.query(`CREATE TABLE "proba_templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "level" integer NOT NULL, "gender_variant" "public"."proba_templates_gender_variant_enum" NOT NULL DEFAULT 'NEUTRAL', "version" integer NOT NULL DEFAULT '1', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_ccb1f335dbcf058166d68363e13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proba_section_templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "order" integer NOT NULL, "template_id" uuid, CONSTRAINT "PK_d42048c4d50ff81705b3a03ed3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proba_item_templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "text" text NOT NULL, "order" integer NOT NULL, "section_id" uuid, CONSTRAINT "PK_7c832adab4716758826c1860cfb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_proba_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_completed" boolean NOT NULL DEFAULT false, "completed_at" TIMESTAMP, "user_id" uuid, "proba_item_id" uuid, "signed_by_id" uuid, CONSTRAINT "PK_a04a113e802c4b33c5f896c4b3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "inviteToken" character varying(255) NOT NULL, "owner_id" uuid, CONSTRAINT "UQ_e06a15fe07798ea0e6c34f36228" UNIQUE ("inviteToken"), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e06a15fe07798ea0e6c34f3622" ON "groups" ("inviteToken") `);
        await queryRunner.query(`CREATE TABLE "group_memberships" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "group_id" uuid, CONSTRAINT "UQ_e9a383a45af8eff11505d527620" UNIQUE ("user_id", "group_id"), CONSTRAINT "PK_4a04ebe9f25ad41f45b2c0ca4b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_sex_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "sex" "public"."users_sex_enum", "picture" character varying, "is_guide_complete" boolean NOT NULL, "role_id" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."invites_role_to_assign_enum" AS ENUM('ADMIN', 'LIAISON', 'FOREMAN', 'SCOUT')`);
        await queryRunner.query(`CREATE TABLE "invites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "hash" character varying NOT NULL, "status" boolean NOT NULL, "expired_at" TIMESTAMP NOT NULL, "role_to_assign" "public"."invites_role_to_assign_enum" NOT NULL, "foreman_id" uuid, "scout_id" uuid, CONSTRAINT "PK_aa52e96b44a714372f4dd31a0af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proba_notes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "content" text NOT NULL, "progress_id" uuid, "created_by_id" uuid, CONSTRAINT "PK_e7106d02d1df578073a1fc6d294" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "proba_section_templates" ADD CONSTRAINT "FK_457a0ef9ee7d8d58dd846967fe3" FOREIGN KEY ("template_id") REFERENCES "proba_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proba_item_templates" ADD CONSTRAINT "FK_3c360baa15234e1037b14a2e541" FOREIGN KEY ("section_id") REFERENCES "proba_section_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_proba_progress" ADD CONSTRAINT "FK_2e1bdceeb50d4391501b9203037" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_proba_progress" ADD CONSTRAINT "FK_77feab6958d2526f775a07baa25" FOREIGN KEY ("proba_item_id") REFERENCES "proba_item_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_proba_progress" ADD CONSTRAINT "FK_7f3fb127e0e105cdf11cc832f46" FOREIGN KEY ("signed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_5d7af25843377def343ab0beaa8" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_memberships" ADD CONSTRAINT "FK_e232a617b3bc2de2e13c0289d62" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_memberships" ADD CONSTRAINT "FK_cad344fe877fcee0ac7e065ed05" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_9ff46285fb5f05b824d68b75e4a" FOREIGN KEY ("foreman_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_c050267df909b5bf9ad9b3b943b" FOREIGN KEY ("scout_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proba_notes" ADD CONSTRAINT "FK_3391265d1c82e5e4c44d38f13a6" FOREIGN KEY ("progress_id") REFERENCES "user_proba_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proba_notes" ADD CONSTRAINT "FK_46af8819133b9189c6d5bc748bd" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "proba_notes" DROP CONSTRAINT "FK_46af8819133b9189c6d5bc748bd"`);
        await queryRunner.query(`ALTER TABLE "proba_notes" DROP CONSTRAINT "FK_3391265d1c82e5e4c44d38f13a6"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_c050267df909b5bf9ad9b3b943b"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_9ff46285fb5f05b824d68b75e4a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "group_memberships" DROP CONSTRAINT "FK_cad344fe877fcee0ac7e065ed05"`);
        await queryRunner.query(`ALTER TABLE "group_memberships" DROP CONSTRAINT "FK_e232a617b3bc2de2e13c0289d62"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_5d7af25843377def343ab0beaa8"`);
        await queryRunner.query(`ALTER TABLE "user_proba_progress" DROP CONSTRAINT "FK_7f3fb127e0e105cdf11cc832f46"`);
        await queryRunner.query(`ALTER TABLE "user_proba_progress" DROP CONSTRAINT "FK_77feab6958d2526f775a07baa25"`);
        await queryRunner.query(`ALTER TABLE "user_proba_progress" DROP CONSTRAINT "FK_2e1bdceeb50d4391501b9203037"`);
        await queryRunner.query(`ALTER TABLE "proba_item_templates" DROP CONSTRAINT "FK_3c360baa15234e1037b14a2e541"`);
        await queryRunner.query(`ALTER TABLE "proba_section_templates" DROP CONSTRAINT "FK_457a0ef9ee7d8d58dd846967fe3"`);
        await queryRunner.query(`DROP TABLE "proba_notes"`);
        await queryRunner.query(`DROP TABLE "invites"`);
        await queryRunner.query(`DROP TYPE "public"."invites_role_to_assign_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_sex_enum"`);
        await queryRunner.query(`DROP TABLE "group_memberships"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e06a15fe07798ea0e6c34f3622"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "user_proba_progress"`);
        await queryRunner.query(`DROP TABLE "proba_item_templates"`);
        await queryRunner.query(`DROP TABLE "proba_section_templates"`);
        await queryRunner.query(`DROP TABLE "proba_templates"`);
        await queryRunner.query(`DROP TYPE "public"."proba_templates_gender_variant_enum"`);
    }

}
