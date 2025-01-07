// import { EntitySchema } from "typeorm"
// import { BaseColumnSchemaPart } from "./base.schema"

// export interface ISubProbaTemplate {
//   id: string
//   parent_proba_template_id: string
//   sub_proba_template_id: string
//   title: string
// }

// export const SubProbaTemplateSchema = new EntitySchema<ISubProbaTemplate>({
//   name: "sub_proba_template",
//   columns: {
//     ...BaseColumnSchemaPart,
//     title: {
//       type: String,
//     },
//   },
//   relations: {
//     parent_proba_template_id: {
//       type: "many-to-one",
//       target: "proba_template",
//     },
//     sub_proba_template_id: {
//       type: "many-to-one",
//       target: "sub_proba_template",
//       nullable: true,
//     },
//   },
// })
