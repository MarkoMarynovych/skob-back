import { Column, Entity, OneToMany } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { SkillSchema } from "./skill.schema"

export interface IGeneralSkill {
  id: string
  title: string
  skills?: SkillSchema[]
}

@Entity("general_skill")
export class GeneralSkillSchema extends AbstractEntity<IGeneralSkill> {
  @Column()
  title: string

  @OneToMany(() => SkillSchema, (skill) => skill.general_skill)
  skills: SkillSchema[]
}
