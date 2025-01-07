// import { EntitySchema } from "typeorm"
// import { BaseColumnSchemaPart } from "./base.schema"

// export interface IDates {
//   id: string
//   foreman_id: string
//   scout_id: string
//   title: string
//   description: string
//   date: Date
// }

// export const DatesSchema = new EntitySchema<IDates>({
//   name: "dates",
//   columns: {
//     ...BaseColumnSchemaPart,
//     title: {
//       type: String,
//     },
//     description: {
//       type: String,
//     },
//     date: {
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
