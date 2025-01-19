import { InviteSchema } from "./schemas/invite.schema"
import { ProbaItemSchema } from "./schemas/proba-item.schema"
import { ProbaTemplateSchema } from "./schemas/proba-template.schema"
import { ScoutsForemansSchema } from "./schemas/scouts-foremans.schema"
import { UserProbaProgressSchema } from "./schemas/user-proba-progress.schema"
import { UserSchema } from "./schemas/user.schema"

export const POSTGRES_SCHEMAS = [UserSchema, ScoutsForemansSchema, InviteSchema, ProbaTemplateSchema, ProbaItemSchema, UserProbaProgressSchema]
