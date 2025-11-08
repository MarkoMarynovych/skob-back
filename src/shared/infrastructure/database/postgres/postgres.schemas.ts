import { InviteSchema } from "./schemas/invite.schema"
import { ProbaTemplateSchema } from "./schemas/proba-template.schema"
import { ProbaSectionTemplateSchema } from "./schemas/proba-section-template.schema"
import { ProbaItemTemplateSchema } from "./schemas/proba-item-template.schema"
import { ProbaNoteSchema } from "./schemas/proba-note.schema"
import { UserProbaProgressSchema } from "./schemas/user-proba-progress.schema"
import { UserSchema } from "./schemas/user.schema"
import { RoleSchema } from "./schemas/role.schema"
import { GroupSchema } from "./schemas/group.schema"
import { GroupMembershipSchema } from "./schemas/group-membership.schema"
import { KurinSchema } from "./schemas/kurin.schema"

export const POSTGRES_SCHEMAS = [
  KurinSchema,
  UserSchema,
  RoleSchema,
  GroupSchema,
  GroupMembershipSchema,
  InviteSchema,
  ProbaTemplateSchema,
  ProbaSectionTemplateSchema,
  ProbaItemTemplateSchema,
  UserProbaProgressSchema,
  ProbaNoteSchema,
]
