import { Role } from "src/modules/users/application/enums/role.enum"
import { Column, Entity } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"

export interface IRole {
  id: string
  roles: Role
}

@Entity("roles")
export class RoleSchema extends AbstractEntity<IRole> {
  @Column({ type: "enum", enum: Role, default: Role.SCOUT })
  roles: Role
}
