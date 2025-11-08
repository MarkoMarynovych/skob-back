import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { UserProbaProgressSchema } from "./user-proba-progress.schema"
import { UserSchema } from "./user.schema"

@Entity("proba_notes")
export class ProbaNoteSchema extends AbstractEntity<{}> {
  @Column({ type: "text" })
  content: string

  @ManyToOne(() => UserProbaProgressSchema, { onDelete: "CASCADE" })
  @JoinColumn({ name: "progress_id" })
  progress: UserProbaProgressSchema

  @ManyToOne(() => UserSchema, { onDelete: "CASCADE" })
  @JoinColumn({ name: "created_by_id" })
  createdBy: UserSchema
}
