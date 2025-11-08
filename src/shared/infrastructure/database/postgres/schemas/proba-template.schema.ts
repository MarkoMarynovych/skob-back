import { Column, Entity, OneToMany } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { ProbaSectionTemplateSchema } from "./proba-section-template.schema"

@Entity("proba_templates")
export class ProbaTemplateSchema extends AbstractEntity<{}> {
  @Column({ length: 255 })
  name: string // e.g., "Перша проба"

  @Column()
  level: number // e.g., 0, 1, 2

  @Column({
    type: "enum",
    enum: ["MALE", "FEMALE", "NEUTRAL"],
    default: "NEUTRAL",
  })
  gender_variant: string

  @Column({ default: 1 })
  version: number

  @Column({ default: true })
  is_active: boolean

  @OneToMany(() => ProbaSectionTemplateSchema, (section) => section.template)
  sections: ProbaSectionTemplateSchema[]
}
