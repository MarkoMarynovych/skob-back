// import { EntitySchema } from "typeorm"
// import { BaseColumnSchemaPart } from "./base.schema"

// export interface IUserProbas {
//   id: string
//   user_id: string
//   proba_template_id: string
//   status: boolean
//   completed_at: Date
// }

// export const UserProbasSchema = new EntitySchema<IUserProbas>({
//   name: "users_probas",
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
//     proba_template_id: {
//       type: "many-to-one",
//       target: "proba_template",
//     },
//   },
// })
