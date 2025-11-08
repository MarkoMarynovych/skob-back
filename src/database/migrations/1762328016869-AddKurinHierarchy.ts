import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKurinHierarchy1762328016869 implements MigrationInterface {
    name = 'AddKurinHierarchy1762328016869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."invites_type_enum" AS ENUM('LIAISON', 'FOREMAN', 'SCOUT', 'CO_FOREMAN')`);
        await queryRunner.query(`CREATE TABLE "kurins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "liaison_id" uuid, CONSTRAINT "PK_kurins_id" PRIMARY KEY ("id"))`);

        await queryRunner.query(`DROP TABLE "invites"`);
        await queryRunner.query(`DROP TYPE "public"."invites_role_to_assign_enum"`);

        await queryRunner.query(`CREATE TABLE "invites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying NOT NULL, "type" "public"."invites_type_enum" NOT NULL, "context_id" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "created_by_id" uuid, CONSTRAINT "UQ_invites_token" UNIQUE ("token"), CONSTRAINT "PK_invites_id" PRIMARY KEY ("id"))`);

        await queryRunner.query(`ALTER TABLE "users" ADD "kurin_id" uuid`);

        await queryRunner.query(`ALTER TABLE "kurins" ADD CONSTRAINT "FK_kurins_liaison_id" FOREIGN KEY ("liaison_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_users_kurin_id" FOREIGN KEY ("kurin_id") REFERENCES "kurins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_invites_created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_invites_created_by_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_kurin_id"`);
        await queryRunner.query(`ALTER TABLE "kurins" DROP CONSTRAINT "FK_kurins_liaison_id"`);

        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "kurin_id"`);

        await queryRunner.query(`DROP TABLE "invites"`);
        await queryRunner.query(`DROP TYPE "public"."invites_type_enum"`);
        await queryRunner.query(`DROP TABLE "kurins"`);

        await queryRunner.query(`CREATE TYPE "public"."invites_role_to_assign_enum" AS ENUM('ADMIN', 'LIAISON', 'FOREMAN', 'SCOUT')`);
        await queryRunner.query(`CREATE TABLE "invites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "hash" character varying NOT NULL, "status" boolean NOT NULL, "expired_at" TIMESTAMP NOT NULL, "role_to_assign" "public"."invites_role_to_assign_enum" NOT NULL, "foreman_id" uuid, "scout_id" uuid, CONSTRAINT "PK_aa52e96b44a714372f4dd31a0af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_9ff46285fb5f05b824d68b75e4a" FOREIGN KEY ("foreman_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_c050267df909b5bf9ad9b3b943b" FOREIGN KEY ("scout_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
