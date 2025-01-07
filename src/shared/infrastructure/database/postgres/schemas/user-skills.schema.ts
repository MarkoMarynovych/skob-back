// import { EntitySchema } from "typeorm"
// import { BaseColumnSchemaPart } from "./base.schema"

// export interface IUserSkills {
//   id: string
//   skill_id: string
//   user_id: string
// }

// export const UserSkillsSchema = new EntitySchema<IUserSkills>({
//   name: "users_skills",
//   columns: {
//     ...BaseColumnSchemaPart,
//   },
//   relations: {
//     skill_id: {
//       type: "many-to-one",
//       target: "skill",
//     },
//     user_id: {
//       type: "many-to-one",
//       target: "users",
//     },
//   },
// })
