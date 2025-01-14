import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { UserSchema } from "./user.schema"

export interface IDates {
  id: string
  foreman_id: string
  scout_id: string
  title: string
  description: string
  date: Date
}

@Entity("dates")
export class DatesSchema extends AbstractEntity<IDates> {
  @ManyToOne(() => UserSchema, (user) => user.id)
  @JoinColumn({ name: "foreman_id" })
  foreman: UserSchema

  @ManyToOne(() => UserSchema, (user) => user.id)
  @JoinColumn({ name: "scout_id" })
  scout: UserSchema

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  date: Date
}
