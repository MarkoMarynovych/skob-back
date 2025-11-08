import { KurinSchema } from "~shared/infrastructure/database/postgres/schemas/kurin.schema"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"

export interface KurinStats {
  id: string
  name: string
  liaison?: {
    id: string
    name: string
    email: string
  }
  foremanCount: number
  groupCount: number
  scoutCount: number
}

export interface ForemanWithStats {
  id: string
  name: string
  email: string
  groupCount: number
  scoutCount: number
  averageProgress: number
}

export interface KurinDetails {
  id: string
  name: string
  liaison?: {
    id: string
    name: string
    email: string
  }
  foremen: ForemanWithStats[]
}

export interface IKurinRepository {
  findAll(): Promise<KurinSchema[]>
  findAllWithStats(): Promise<KurinStats[]>
  findById(id: string): Promise<KurinSchema | null>
  findByIdWithForemen(id: string): Promise<KurinDetails | null>
  create(name: string, liaison?: UserSchema): Promise<KurinSchema>
  update(id: string, data: { name?: string; liaison?: UserSchema }): Promise<KurinSchema>
  delete(id: string): Promise<void>
}

export const KurinDITokens = {
  KURIN_REPOSITORY: Symbol("KURIN_REPOSITORY"),
}
