import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { ProbaSectionTemplateSchema } from "./proba-section-template.schema"

@Entity("proba_item_templates")
export class ProbaItemTemplateSchema extends AbstractEntity<{}> {
  @Column({ type: "text" })
  text: string

  @Column()
  order: number

  @ManyToOne(() => ProbaSectionTemplateSchema, (section) => section.items, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "section_id" })
  section: ProbaSectionTemplateSchema
}
