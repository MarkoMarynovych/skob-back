import { Entity, JoinColumn, ManyToOne } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { SkillSchema } from "./skill.schema"
import { UserSchema } from "./user.schema"

export interface IUserSkills {
  id: string
  skill_id: string
  user_id: string
}

@Entity("users_skills")
export class UserSkillsSchema extends AbstractEntity<IUserSkills> {
  @ManyToOne(() => SkillSchema, (skill) => skill.id)
  @JoinColumn({ name: "skill_id" })
  skill: SkillSchema

  @ManyToOne(() => UserSchema, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: UserSchema
}
