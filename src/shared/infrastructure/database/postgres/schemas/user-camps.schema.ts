// import { EntitySchema } from "typeorm"
// import { BaseColumnSchemaPart } from "./base.schema"

// export interface IUserCamps {
//   id: string
//   camp_id: string
//   user_id: string
// }

// export const UserCampsSchema = new EntitySchema<IUserCamps>({
//   name: "user_camps",
//   columns: {
//     ...BaseColumnSchemaPart,
//   },
//   relations: {
//     camp_id: {
//       type: "many-to-one",
//       target: "camps",
//     },
//     user_id: {
//       type: "many-to-one",
//       target: "users",
//     },
//   },
// })
