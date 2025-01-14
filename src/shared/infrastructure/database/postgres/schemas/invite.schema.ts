import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { UserSchema } from "./user.schema"

export interface IInvite {
  id: string
  foreman_id: UserSchema
  scout_id: UserSchema
  status: boolean
}

@Entity("invites")
export class InviteSchema extends AbstractEntity<IInvite> {
  @Column()
  hash: string

  @Column()
  status: boolean

  @Column()
  expired_at: Date

  @ManyToOne(() => UserSchema, (user) => user.id)
  @JoinColumn({ name: "foreman_id" })
  foreman: UserSchema

  @ManyToOne(() => UserSchema, (user) => user.id)
  @JoinColumn({ name: "scout_id" })
  scout: UserSchema
}
