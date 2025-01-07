// import { EntitySchema } from "typeorm"
// import { BaseColumnSchemaPart } from "./base.schema"

// export interface IInvite {
//   id: string
//   foreman_id: string
//   scout_id: string
//   status: boolean
//   created_at: Date
//   expired_at: Date
// }

// export const InviteSchema = new EntitySchema<IInvite>({
//   name: "invites",
//   columns: {
//     ...BaseColumnSchemaPart,
//     status: {
//       type: Boolean,
//     },
//     expired_at: {
//       type: Date,
//     },
//   },
//   relations: {
//     foreman_id: {
//       type: "many-to-one",
//       target: "users",
//     },
//     scout_id: {
//       type: "many-to-one",
//       target: "users",
//     },
//   },
// })
