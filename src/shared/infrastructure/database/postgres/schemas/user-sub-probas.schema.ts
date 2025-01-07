// import { EntitySchema } from "typeorm"
// import { BaseColumnSchemaPart } from "./base.schema"

// export interface IUserSubProbas {
//   id: string
//   user_id: string
//   sub_proba_template_id: string
//   status: boolean
//   completed_at: Date
// }

// export const UserSubProbasSchema = new EntitySchema<IUserSubProbas>({
//   name: "users_sub_probas",
//   columns: {
//     ...BaseColumnSchemaPart,
//     status: {
//       type: Boolean,
//     },
//     completed_at: {
//       type: Date,
//     },
//   },
//   relations: {
//     user_id: {
//       type: "many-to-one",
//       target: "users",
//     },
//     sub_proba_template_id: {
//       type: "many-to-one",
//       target: "sub_proba_template",
//     },
//   },
// })
