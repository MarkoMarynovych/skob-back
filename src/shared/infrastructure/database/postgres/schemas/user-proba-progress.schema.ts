import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ProbaItemTemplateSchema } from "./proba-item-template.schema"
import { UserSchema } from "./user.schema"
import { ProbaNoteSchema } from "./proba-note.schema"

@Entity("user_proba_progress")
export class UserProbaProgressSchema {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => UserSchema, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: UserSchema

  @ManyToOne(() => ProbaItemTemplateSchema, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "proba_item_id" })
  proba_item: ProbaItemTemplateSchema

  @Column({ default: false })
  is_completed: boolean

  @Column({ type: "timestamp", nullable: true })
  completed_at: Date

  @ManyToOne(() => UserSchema, { nullable: true, onDelete: "SET NULL", eager: true })
  @JoinColumn({ name: "signed_by_id" })
  signed_by: UserSchema

  @OneToMany(() => ProbaNoteSchema, (note) => note.progress)
  notes: ProbaNoteSchema[]
}
