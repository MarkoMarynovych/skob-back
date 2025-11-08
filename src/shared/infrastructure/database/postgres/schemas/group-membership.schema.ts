import { Entity, JoinColumn, ManyToOne, Unique } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { UserSchema } from "./user.schema"
import { GroupSchema } from "./group.schema"

@Entity("group_memberships")
@Unique(["user", "group"]) // A user can only be in a group once
export class GroupMembershipSchema extends AbstractEntity<{}> {
  @ManyToOne(() => UserSchema, (user) => user.memberships, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: UserSchema

  @ManyToOne(() => GroupSchema, (group) => group.memberships, { onDelete: "CASCADE" })
  @JoinColumn({ name: "group_id" })
  group: GroupSchema
}
