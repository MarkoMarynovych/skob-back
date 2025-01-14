import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { GeneralSkillSchema } from "./general-skill.schema"

export interface ISkill {
  id: string
  title: string
  general_skill_id: string
  level: number
}

@Entity("skills")
export class SkillSchema extends AbstractEntity<ISkill> {
  @Column()
  title: string

  @ManyToOne(() => GeneralSkillSchema, (generalSkill) => generalSkill.id)
  @JoinColumn({ name: "general_skill_id" })
  general_skill: GeneralSkillSchema

  @Column()
  level: number
}
