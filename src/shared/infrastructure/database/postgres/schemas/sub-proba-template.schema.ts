import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { ProbaTemplateSchema } from "./proba-template.schema"
import { UserSubProbasSchema } from "./user-sub-probas.schema"

export interface ISubProbaTemplate {
  id: string
  parent_proba_template_id: string
  sub_parent_template_id: string
  title: string
  userSubProbas?: UserSubProbasSchema[]
  subTemplates?: SubProbaTemplateSchema[]
}

@Entity("sub_proba_template")
export class SubProbaTemplateSchema extends AbstractEntity<ISubProbaTemplate> {
  @Column()
  title: string

  @ManyToOne(() => ProbaTemplateSchema, (probaTemplate) => probaTemplate.subProbas)
  @JoinColumn({ name: "parent_proba_template_id" })
  parent_proba_template: ProbaTemplateSchema

  @ManyToOne(() => SubProbaTemplateSchema, (subProba) => subProba.subTemplates)
  @JoinColumn({ name: "sub_parent_template_id" })
  sub_parent_template: SubProbaTemplateSchema

  @OneToMany(() => SubProbaTemplateSchema, (subProba) => subProba.sub_parent_template)
  subTemplates: SubProbaTemplateSchema[]

  @OneToMany(() => UserSubProbasSchema, (userSubProba) => userSubProba.sub_proba_template)
  userSubProbas: UserSubProbasSchema[]
}
