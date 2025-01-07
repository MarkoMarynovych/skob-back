// import { Role } from "src/modules/users/application/enums/role.enum"
// import { EntitySchema } from "typeorm"
// import { BaseColumnSchemaPart } from "./base.schema"

// export interface IRole {
//   id: string
//   roles: Role
// }

// export const RoleSchema = new EntitySchema<IRole>({
//   name: "roles",
//   columns: {
//     ...BaseColumnSchemaPart,
//     roles: {
//       type: "enum",
//       enum: Role,
//       default: Role.SCOUT,
//     },
//   },
// })
