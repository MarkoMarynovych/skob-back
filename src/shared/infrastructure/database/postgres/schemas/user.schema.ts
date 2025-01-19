import { Sex } from "src/modules/users/application/enums/sex.enum"
import { Column, Entity, OneToMany } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { InviteSchema } from "./invite.schema"
import { ScoutsForemansSchema } from "./scouts-foremans.schema"
import { UserProbaProgressSchema } from "./user-proba-progress.schema"

interface IUser {
  name: string
  email: string
  sex?: Sex
  is_guide_complete: boolean
  picture?: string
  foremans?: ScoutsForemansSchema[]
  scouts?: ScoutsForemansSchema[]
  proba_progress?: UserProbaProgressSchema[]
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

  @OneToMany(() => UserProbaProgressSchema, (progress) => progress.user)
  proba_progress: UserProbaProgressSchema[]

  @OneToMany(() => InviteSchema, (invite) => invite.scout)
  receivedInvites: InviteSchema[]

  @OneToMany(() => InviteSchema, (invite) => invite.foreman)
  sentInvites: InviteSchema[]
}
