import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { InviteType } from "~modules/invites/domain/enums/invite-type.enum"
import { UserSchema } from "./user.schema"

export interface IInvite {
  id: string
  token: string
  type: InviteType
  contextId: string
  expiresAt: Date
  createdBy?: UserSchema
}

@Entity("invites")
export class InviteSchema extends AbstractEntity<IInvite> {
  @Column({ unique: true })
  token: string

  @Column({ type: "enum", enum: InviteType })
  type: InviteType

  @Column({ name: "context_id" })
  contextId: string

  @Column({ name: "expires_at" })
  expiresAt: Date

  @ManyToOne(() => UserSchema, { nullable: true })
  @JoinColumn({ name: "created_by_id" })
  createdBy: UserSchema
}
