import { Sex } from "src/modules/users/application/enums/sex.enum"
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { UserProbaProgressSchema } from "./user-proba-progress.schema"
import { RoleSchema } from "./role.schema"
import { GroupMembershipSchema } from "./group-membership.schema"
import { KurinSchema } from "./kurin.schema"

interface IUser {
  name: string
  email: string
  sex?: Sex
  is_guide_complete: boolean
  picture?: string
  proba_progress?: UserProbaProgressSchema[]
  memberships?: GroupMembershipSchema[]
  role?: RoleSchema
  kurin?: KurinSchema
}

@Entity("users")
export class UserSchema extends AbstractEntity<IUser> {
  @Column()
  name: string

  @Column({ unique: true }) // Add unique constraint
  email: string

  @Column({ type: "enum", enum: Sex, nullable: true })
  sex?: Sex

  @Column({ nullable: true })
  picture?: string

  @Column()
  is_guide_complete: boolean

  @ManyToOne(() => RoleSchema)
  @JoinColumn({ name: "role_id" })
  role: RoleSchema

  @ManyToOne(() => KurinSchema, (kurin) => kurin.members, { nullable: true })
  @JoinColumn({ name: "kurin_id" })
  kurin: KurinSchema

  @OneToMany(() => GroupMembershipSchema, (membership) => membership.user)
  memberships: GroupMembershipSchema[]

  @OneToMany(() => UserProbaProgressSchema, (progress) => progress.user)
  proba_progress: UserProbaProgressSchema[]
}
