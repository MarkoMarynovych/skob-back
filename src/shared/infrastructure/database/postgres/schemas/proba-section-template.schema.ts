import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { ProbaTemplateSchema } from "./proba-template.schema"
import { ProbaItemTemplateSchema } from "./proba-item-template.schema"

@Entity("proba_section_templates")
export class ProbaSectionTemplateSchema extends AbstractEntity<{}> {
  @Column({ length: 255 })
  title: string

  @Column()
  order: number

  @ManyToOne(() => ProbaTemplateSchema, (template) => template.sections, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "template_id" })
  template: ProbaTemplateSchema

  @OneToMany(() => ProbaItemTemplateSchema, (item) => item.section)
  items: ProbaItemTemplateSchema[]
}
