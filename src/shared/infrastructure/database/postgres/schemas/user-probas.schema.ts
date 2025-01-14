import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { ProbaTemplateSchema } from "./proba-template.schema"
import { UserSchema } from "./user.schema"

export interface IUserProbas {
  id: string
  user_id: string
  proba_template_id: string
  status: boolean
  completed_at: Date
}

@Entity("users_probas")
export class UserProbasSchema extends AbstractEntity<IUserProbas> {
  @ManyToOne(() => UserSchema, (user) => user.probas)
  @JoinColumn({ name: "user_id" })
  user: UserSchema

  @ManyToOne(() => ProbaTemplateSchema, (template) => template.id)
  @JoinColumn({ name: "proba_template_id" })
  proba_template: ProbaTemplateSchema

  @Column()
  status: boolean

  @Column({ nullable: true })
  completed_at: Date
}
