// import { Entity, JoinColumn, ManyToOne } from "typeorm"
// import { AbstractEntity } from "~shared/domain/entities/entity"
// import { CampSchema } from "./camp.schema"
// import { UserSchema } from "./user.schema"

// export interface IUserCamps {
//   id: string
//   camp_id: string
//   user_id: string
// }

// @Entity("user_camps")
// export class UserCampsSchema extends AbstractEntity<IUserCamps> {
//   @ManyToOne(() => CampSchema, (camp) => camp.id)
//   @JoinColumn({ name: "camp_id" })
//   camp: CampSchema

//   @ManyToOne(() => UserSchema, (user) => user.camps)
//   @JoinColumn({ name: "user_id" })
//   user: UserSchema
// }
