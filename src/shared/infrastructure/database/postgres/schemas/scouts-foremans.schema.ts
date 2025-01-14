import { Entity, JoinColumn, ManyToOne } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { UserSchema } from "./user.schema"

interface IScoutsForemans {
  foreman: UserSchema
  scout: UserSchema
}

@Entity("scouts_foremans")
export class ScoutsForemansSchema extends AbstractEntity<IScoutsForemans> {
  @ManyToOne(() => UserSchema, (user) => user.scouts)
  @JoinColumn({ name: "user_id" })
  scout: UserSchema

  @ManyToOne(() => UserSchema, (user) => user.foremans)
  @JoinColumn({ name: "foreman_id" })
  foreman: UserSchema
}
