import { DataSource } from "typeorm"
import { ProbaItemSchema } from "../schemas/proba-item.schema"
import { ProbaTemplateSchema } from "../schemas/proba-template.schema"

const FIRST_PROBA = [
  { section: "А", name: "Три головні обов'язки пластуна", items: 11 },
  { section: "Б", name: "Пластова Ідея", items: 7 },
  { section: "В", name: "Пластова організація", items: 4 },
  { section: "Г", name: "Пластові заняття", items: 6 },
  { section: "Ґ", name: "Життя в природі", items: 10 },
  { section: "Д", name: "Життєва зарадність", items: 9 },
  { section: "Е", name: "Тіловиховання", items: 4 },
  { section: "Є", name: "Юнацькі вмілості", items: 7 },
]

const SECOND_PROBA = [
  { section: "А", name: "Три головні обов'язки пластуна", items: 10 },
  { section: "Б", name: "Пластова ідея та організація", items: 10 },
  { section: "В", name: "Пластові заняття", items: 3 },
  { section: "Г", name: "Життя в природі", items: 7 },
  { section: "Ґ", name: "Життєва зарадність", items: 9 },
  { section: "Д", name: "Тіловиховання", items: 2 },
  { section: "Е", name: "Юнацькі вмілості", items: 1 },
]

const ZERO_PROBA = [{ section: "A", name: "Прихильник Пласту", items: 11 }]

export const seedProbas = async (dataSource: DataSource) => {
  const probaRepo = dataSource.getRepository(ProbaTemplateSchema)
  const itemRepo = dataSource.getRepository(ProbaItemSchema)

  const existingTemplates = await probaRepo.find()
  if (existingTemplates.length > 0) {
    console.log("Probas already seeded, skipping...")
    return
  }

  for (const [index, section] of FIRST_PROBA.entries()) {
    const template = await probaRepo.save({
      name: "Перша проба",
      section: section.section,
      section_name: section.name,
      order: index + 1,
    })

    await itemRepo.save(
      Array(section.items)
        .fill(0)
        .map((_, idx) => ({
          order: idx + 1,
          template,
        }))
    )
  }

  for (const [index, section] of SECOND_PROBA.entries()) {
    const template = await probaRepo.save({
      name: "Друга проба",
      section: section.section,
      section_name: section.name,
      order: index + 1,
    })

    await itemRepo.save(
      Array(section.items)
        .fill(0)
        .map((_, idx) => ({
          order: idx + 1,
          template,
        }))
    )
  }

  for (const [index, section] of ZERO_PROBA.entries()) {
    const template = await probaRepo.save({
      name: "Прихильник Пласту",
      section: section.section,
      section_name: section.name,
      order: index + 1,
    })

    await itemRepo.save(
      Array(section.items)
        .fill(0)
        .map((_, idx) => ({
          order: idx + 1,
          template,
        }))
    )
  }
}
