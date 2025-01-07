// import { EntitySchema } from "typeorm"
// import { BaseColumnSchemaPart } from "./base.schema"

// export interface IScoutsForemans {
//   id: string
//   foreman_id: string
//   user_id: string
// }

// export const ScoutsForemansSchema = new EntitySchema<IScoutsForemans>({
//   name: "scouts_foremans",
//   columns: {
//     ...BaseColumnSchemaPart,
//   },
//   relations: {
//     foreman_id: {
//       type: "many-to-one",
//       target: "users",
//       joinColumn: {
//         name: "foreman_id",
//       },
//     },
//     user_id: {
//       type: "one-to-one",
//       target: "users",
//       joinColumn: {
//         name: "user_id",
//       },
//     },
//   },
// })
