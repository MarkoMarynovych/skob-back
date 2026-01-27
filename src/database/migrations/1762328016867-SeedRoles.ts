import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedRoles1762328016867 implements MigrationInterface {
  name = "SeedRoles1762328016867"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO roles (id, created_at, update_at, name) VALUES
            (uuid_generate_v4(), now(), now(), 'ADMIN'),
            (uuid_generate_v4(), now(), now(), 'LIAISON'),
            (uuid_generate_v4(), now(), now(), 'FOREMAN'),
            (uuid_generate_v4(), now(), now(), 'SCOUT')
            ON CONFLICT (name) DO NOTHING;
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM roles WHERE name IN ('ADMIN', 'LIAISON', 'FOREMAN', 'SCOUT');
        `)
  }
}
