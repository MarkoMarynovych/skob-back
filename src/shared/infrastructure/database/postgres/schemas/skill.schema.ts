// import { EntitySchema } from "typeorm"
// import { BaseColumnSchemaPart } from "./base.schema"

// export interface ISkill {
//   id: string
//   title: string
//   general_skill_Id: string[]
//   level: number
// }

// export const SkillSchema = new EntitySchema<ISkill>({
//   name: "skill",
//   columns: {
//     ...BaseColumnSchemaPart,
//     title: {
//       type: String,
//     },
//     level: {
//       type: Number,
//     },
//   },
//   relations: {
//     general_skill_Id: {
//       type: "one-to-many",
//       target: "general_skill",
//       inverseSide: "skill_id",
//     },
//   },
// })
