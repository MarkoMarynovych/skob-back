import { MigrationInterface, QueryRunner } from "typeorm";

export class ReinitializeUserProbaProgress1762696558753 implements MigrationInterface {
    name = 'ReinitializeUserProbaProgress1762696558753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user_proba_progress"`);

        const users = await queryRunner.query(`
            SELECT id, sex FROM users WHERE sex IS NOT NULL
        `);

        for (const user of users) {
            const items = await queryRunner.query(`
                SELECT pit.id
                FROM proba_item_templates pit
                JOIN proba_section_templates pst ON pit.section_id = pst.id
                JOIN proba_templates pt ON pst.template_id = pt.id
                WHERE pt.gender_variant = $1 OR pt.gender_variant = 'NEUTRAL'
            `, [user.sex]);

            for (const item of items) {
                await queryRunner.query(`
                    INSERT INTO user_proba_progress (id, user_id, proba_item_id, is_completed)
                    VALUES (uuid_generate_v4(), $1, $2, false)
                `, [user.id, item.id]);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        throw new Error("This migration cannot be safely reversed");
    }
}
