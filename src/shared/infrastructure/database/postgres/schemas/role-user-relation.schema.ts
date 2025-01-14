import { Entity, ManyToOne, JoinColumn } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { RoleSchema } from "./role.schema"
import { UserSchema } from "./user.schema"

export interface IRoleUserRelation {
  id: string
  role_id: string
  user_id: string
}

@Entity("roles_users_relation")
export class RoleUserRelationSchema extends AbstractEntity<IRoleUserRelation> {
  @ManyToOne(() => RoleSchema, (role) => role.id)
  @JoinColumn({ name: "role_id" })
  role: RoleSchema

  @ManyToOne(() => UserSchema, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: UserSchema
}
