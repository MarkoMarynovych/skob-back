import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { SubProbaTemplateSchema } from "./sub-proba-template.schema"
import { UserSchema } from "./user.schema"

export interface IUserSubProbas {
  id: string
  user_id: string
  sub_proba_template_id: string
  status: boolean
  completed_at: Date
}

@Entity("user_sub_probas")
export class UserSubProbasSchema extends AbstractEntity<IUserSubProbas> {
  @ManyToOne(() => UserSchema, (user) => user.subProbas)
  @JoinColumn({ name: "user_id" })
  user: UserSchema

  @ManyToOne(() => SubProbaTemplateSchema, (template) => template.id)
  @JoinColumn({ name: "sub_proba_template_id" })
  sub_proba_template: SubProbaTemplateSchema

  @Column()
  status: boolean

  @Column({ nullable: true })
  completed_at: Date
}
