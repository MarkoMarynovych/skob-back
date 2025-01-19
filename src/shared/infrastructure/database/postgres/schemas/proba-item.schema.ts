import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { ProbaTemplateSchema } from "./proba-template.schema"

@Entity("proba_items")
export class ProbaItemSchema {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  order: number

  @ManyToOne(() => ProbaTemplateSchema, (template) => template.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "template_id" })
  template: ProbaTemplateSchema
}
