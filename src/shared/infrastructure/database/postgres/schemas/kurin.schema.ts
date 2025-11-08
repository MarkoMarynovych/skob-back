import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { UserSchema } from "./user.schema"

interface IKurin {
  name: string
  liaison?: UserSchema
  members?: UserSchema[]
}

@Entity("kurins")
export class KurinSchema extends AbstractEntity<IKurin> {
  @Column({ length: 255 })
  name: string

  @ManyToOne(() => UserSchema, { nullable: true })
  @JoinColumn({ name: "liaison_id" })
  liaison: UserSchema

  @OneToMany(() => UserSchema, (user) => user.kurin)
  members: UserSchema[]
}
