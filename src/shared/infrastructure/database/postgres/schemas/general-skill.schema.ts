// import { EntitySchema } from "typeorm"
// import { BaseColumnSchemaPart } from "./base.schema"

// export interface IGeneralSkill {
//   id: string
//   title: string
//   skill_id: string
// }

// export const GeneralSkillSchema = new EntitySchema<IGeneralSkill>({
//   name: "general_skill",
//   columns: {
//     ...BaseColumnSchemaPart,
//     title: {
//       type: String,
//     },
//   },
//   relations: {
//     skill_id: {
//       type: "many-to-one",
//       target: "skill",
//     },
//   },
// })
