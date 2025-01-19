import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ProbaItemSchema } from "./proba-item.schema"

@Entity("proba_template")
export class ProbaTemplateSchema {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  section: string

  @Column()
  section_name: string

  @Column()
  order: number

  @OneToMany(() => ProbaItemSchema, (item) => item.template)
  items: ProbaItemSchema[]
}
