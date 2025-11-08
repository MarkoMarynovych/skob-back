import { Column, Entity } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"

@Entity("roles")
export class RoleSchema extends AbstractEntity<{}> {
  @Column({ unique: true, length: 50 })
  name: string // e.g., 'ADMIN', 'LIAISON', 'FOREMAN', 'SCOUT'
}
