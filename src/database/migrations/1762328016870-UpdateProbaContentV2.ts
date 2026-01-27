import { MigrationInterface, QueryRunner } from "typeorm"
import * as fs from "fs"
import * as path from "path"

interface ProbaItem {
  section: string
  items: string[]
}

interface ProbaData {
  level: number
  gender: "MALE" | "FEMALE"
  name: string
  fileName: string
}

export class UpdateProbaContentV21762328016870 implements MigrationInterface {
  name = "UpdateProbaContentV21762328016870"

  private probaConfigs: ProbaData[] = [
    { level: 0, gender: "MALE", name: "Нульова проба (юнак)", fileName: "proba_0_male.json" },
    { level: 0, gender: "FEMALE", name: "Нульова проба (юначка)", fileName: "proba_0_female.json" },
    { level: 1, gender: "MALE", name: "Перша проба (юнак)", fileName: "proba_1_male.json" },
    { level: 1, gender: "FEMALE", name: "Перша проба (юначка)", fileName: "proba_1_female.json" },
    { level: 2, gender: "MALE", name: "Друга проба (юнак)", fileName: "proba_2_male.json" },
    { level: 2, gender: "FEMALE", name: "Друга проба (юначка)", fileName: "proba_2_female.json" },
  ]

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "proba_item_templates"`)
    await queryRunner.query(`DELETE FROM "proba_section_templates"`)
    await queryRunner.query(`DELETE FROM "proba_templates"`)

    for (const config of this.probaConfigs) {
      const filePath = path.join(__dirname, "data", config.fileName)
      const fileContent = fs.readFileSync(filePath, "utf-8")
      const sections: ProbaItem[] = JSON.parse(fileContent)

      const probaTemplateId = await this.insertProbaTemplate(queryRunner, config.name, config.level, config.gender)

      for (let sectionOrder = 0; sectionOrder < sections.length; sectionOrder++) {
        const section = sections[sectionOrder]
        const sectionTemplateId = await this.insertSectionTemplate(queryRunner, section.section, sectionOrder, probaTemplateId)

        for (let itemOrder = 0; itemOrder < section.items.length; itemOrder++) {
          const itemText = section.items[itemOrder]
          await this.insertItemTemplate(queryRunner, itemText, itemOrder, sectionTemplateId)
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("This migration cannot be safely reversed")
  }

  private async insertProbaTemplate(queryRunner: QueryRunner, name: string, level: number, gender: string): Promise<string> {
    const result = await queryRunner.query(
      `
            INSERT INTO proba_templates (id, created_at, update_at, name, level, gender_variant, version, is_active)
            VALUES (uuid_generate_v4(), now(), now(), $1, $2, $3, 1, true)
            RETURNING id
            `,
      [name, level, gender]
    )
    return result[0].id
  }

  private async insertSectionTemplate(queryRunner: QueryRunner, title: string, order: number, templateId: string): Promise<string> {
    const result = await queryRunner.query(
      `
            INSERT INTO proba_section_templates (id, created_at, update_at, title, "order", template_id)
            VALUES (uuid_generate_v4(), now(), now(), $1, $2, $3)
            RETURNING id
            `,
      [title, order, templateId]
    )
    return result[0].id
  }

  private async insertItemTemplate(queryRunner: QueryRunner, text: string, order: number, sectionId: string): Promise<void> {
    await queryRunner.query(
      `
            INSERT INTO proba_item_templates (id, created_at, update_at, text, "order", section_id)
            VALUES (uuid_generate_v4(), now(), now(), $1, $2, $3)
            `,
      [text, order, sectionId]
    )
  }
}
