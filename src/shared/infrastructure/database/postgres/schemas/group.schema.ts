import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { UserSchema } from "./user.schema"
import { GroupMembershipSchema } from "./group-membership.schema"

@Entity("groups")
export class GroupSchema extends AbstractEntity<{}> {
  @Column({ length: 255 })
  name: string

  @Column({ type: "varchar", length: 255, unique: true })
  @Index()
  inviteToken: string

  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: "owner_id" })
  owner: UserSchema

  @OneToMany(() => GroupMembershipSchema, (membership) => membership.group)
  memberships: GroupMembershipSchema[]
}
