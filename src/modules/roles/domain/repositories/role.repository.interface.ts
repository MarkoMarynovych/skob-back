import { RoleSchema } from "~shared/infrastructure/database/postgres/schemas/role.schema"

export interface IRoleRepository {
  findByName(name: string): Promise<RoleSchema | null>
}

export const RoleDITokens = {
  ROLE_REPOSITORY: Symbol("ROLE_REPOSITORY"),
}
