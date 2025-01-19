import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { ProbaItemSchema } from "./proba-item.schema"
import { UserSchema } from "./user.schema"

@Entity("user_proba_progress")
export class UserProbaProgressSchema {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => UserSchema, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: UserSchema

  @ManyToOne(() => ProbaItemSchema, { onDelete: "CASCADE" })
  @JoinColumn({ name: "proba_item_id" })
  proba_item: ProbaItemSchema

  @Column({ default: false })
  is_completed: boolean

  @Column({ type: "timestamp", nullable: true })
  completed_at: Date

  @ManyToOne(() => UserSchema, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "signed_by_id" })
  signed_by: UserSchema
}
