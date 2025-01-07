// import { EntitySchema } from "typeorm"
// import { BaseColumnSchemaPart } from "./base.schema"

// export interface IRoleUserRelation {
//   id: string
//   role_id: string
//   user_id: string
// }

// export const RoleUserRelationSchema = new EntitySchema<IRoleUserRelation>({
//   name: "roles_users_relation",
//   columns: {
//     ...BaseColumnSchemaPart,
//   },
//   relations: {
//     role_id: {
//       type: "many-to-one",
//       target: "roles",
//     },
//     user_id: {
//       type: "many-to-one",
//       target: "users",
//     },
//   },
// })
