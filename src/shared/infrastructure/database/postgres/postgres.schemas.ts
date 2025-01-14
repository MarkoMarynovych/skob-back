import { CampSchema } from "./schemas/camp.schema"
import { DatesSchema } from "./schemas/dates.schema"
import { GeneralSkillSchema } from "./schemas/general-skill.schema"
import { InviteSchema } from "./schemas/invite.schema"
import { ProbaTemplateSchema } from "./schemas/proba-template.schema"
import { RoleUserRelationSchema } from "./schemas/role-user-relation.schema"
import { RoleSchema } from "./schemas/role.schema"
import { ScoutsForemansSchema } from "./schemas/scouts-foremans.schema"
import { SkillSchema } from "./schemas/skill.schema"
import { SubProbaTemplateSchema } from "./schemas/sub-proba-template.schema"
import { UserCampsSchema } from "./schemas/user-camps.schema"
import { UserProbasSchema } from "./schemas/user-probas.schema"
import { UserSkillsSchema } from "./schemas/user-skills.schema"
import { UserSubProbasSchema } from "./schemas/user-sub-probas.schema"
import { UserSchema } from "./schemas/user.schema"

export const POSTGRES_SCHEMAS = [
  UserSchema,
  CampSchema,
  DatesSchema,
  GeneralSkillSchema,
  ProbaTemplateSchema,
  RoleSchema,
  RoleUserRelationSchema,
  ScoutsForemansSchema,
  SkillSchema,
  SubProbaTemplateSchema,
  UserCampsSchema,
  UserProbasSchema,
  UserSkillsSchema,
  UserSubProbasSchema,
  InviteSchema,
]
