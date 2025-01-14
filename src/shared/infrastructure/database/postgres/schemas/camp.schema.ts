import { Column, Entity, OneToMany } from "typeorm"
import { AbstractEntity } from "~shared/domain/entities/entity"
import { UserCampsSchema } from "./user-camps.schema"

export interface ICamp {
  id: string
  name: string
  start_date: Date
  end_date: Date
  userCamps?: UserCampsSchema[]
}

@Entity("camps")
export class CampSchema extends AbstractEntity<ICamp> {
  @Column()
  name: string

  @Column()
  start_date: Date

  @Column()
  end_date: Date

  @OneToMany(() => UserCampsSchema, (userCamp) => userCamp.camp)
  userCamps: UserCampsSchema[]
}
