import { Column, Entity, OneToMany } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { SubProbaTemplateSchema } from "./sub-proba-template.schema"
import { UserProbasSchema } from "./user-probas.schema"

export interface IProbaTemplate {
  id: string
  title: string
  userProbas?: UserProbasSchema[]
  subProbas?: SubProbaTemplateSchema[]
}

@Entity("proba_template")
export class ProbaTemplateSchema extends AbstractEntity<IProbaTemplate> {
  @Column()
  title: string

  @OneToMany(() => UserProbasSchema, (userProba) => userProba.proba_template)
  userProbas: UserProbasSchema[]

  @OneToMany(() => SubProbaTemplateSchema, (subProba) => subProba.parent_proba_template)
  subProbas: SubProbaTemplateSchema[]
}
