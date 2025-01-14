import { Sex } from "src/modules/users/application/enums/sex.enum"
import { Column, Entity, OneToMany } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { DatesSchema } from "./dates.schema"
import { InviteSchema } from "./invite.schema"
import { ScoutsForemansSchema } from "./scouts-foremans.schema"
import { UserCampsSchema } from "./user-camps.schema"
import { UserProbasSchema } from "./user-probas.schema"
import { UserSkillsSchema } from "./user-skills.schema"
import { UserSubProbasSchema } from "./user-sub-probas.schema"

interface IUser {
  name: string
  email: string
  sex?: Sex
  is_guide_complete: boolean
  picture?: string
  foremans?: ScoutsForemansSchema[]
  scouts?: ScoutsForemansSchema[]
  probas?: UserProbasSchema[]
  subProbas?: UserSubProbasSchema[]
  skills?: UserSkillsSchema[]
  camps?: UserCampsSchema[]
  scoutDates?: DatesSchema[]
  foremanDates?: DatesSchema[]
  receivedInvites?: InviteSchema[]
  sentInvites?: InviteSchema[]
}

@Entity("users")
export class UserSchema extends AbstractEntity<IUser> {
  @Column()
  name: string

  @Column()
  email: string

  @Column({ type: "enum", enum: Sex, nullable: true })
  sex?: Sex

  @Column({ nullable: true })
  picture?: string

  @Column()
  is_guide_complete: boolean

  @OneToMany(() => ScoutsForemansSchema, (scoutForeman) => scoutForeman.foreman)
  foremans: ScoutsForemansSchema[]

  @OneToMany(() => ScoutsForemansSchema, (scoutForeman) => scoutForeman.scout)
  scouts: ScoutsForemansSchema[]

  @OneToMany(() => UserProbasSchema, (userProba) => userProba.user)
  probas: UserProbasSchema[]

  @OneToMany(() => UserSubProbasSchema, (userSubProba) => userSubProba.user)
  subProbas: UserSubProbasSchema[]

  @OneToMany(() => UserSkillsSchema, (userSkill) => userSkill.user)
  skills: UserSkillsSchema[]

  @OneToMany(() => UserCampsSchema, (userCamp) => userCamp.user)
  camps: UserCampsSchema[]

  @OneToMany(() => DatesSchema, (date) => date.scout)
  scoutDates: DatesSchema[]

  @OneToMany(() => DatesSchema, (date) => date.foreman)
  foremanDates: DatesSchema[]

  @OneToMany(() => InviteSchema, (invite) => invite.scout)
  receivedInvites: InviteSchema[]

  @OneToMany(() => InviteSchema, (invite) => invite.foreman)
  sentInvites: InviteSchema[]
}
