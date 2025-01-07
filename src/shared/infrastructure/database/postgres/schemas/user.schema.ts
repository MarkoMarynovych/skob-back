import { Sex } from "src/modules/users/application/enums/sex.enum"
import { Column, Entity } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
// import { IScoutsForemans } from "./scouts-foremans.schema"

export interface IUser {
  id: string
  name: string
  email: string
  sex?: Sex
  is_guide_complete: boolean
  created_at: Date
  update_at: Date
  // foremans?: IScoutsForemans[]
  // scouts?: IScoutsForemans
}

@Entity("users")
export class UserSchema extends AbstractEntity<IUser> {
  @Column() name: string
  @Column() email: string
  @Column({ type: "enum", enum: Sex, nullable: true }) sex?: Sex
  @Column({ nullable: true }) picture?: string
  @Column() is_guide_complete: boolean
}
