import { User } from "../entities/user.entity"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { Role } from "../../application/enums/role.enum"

export interface GroupWithStats {
  id: string
  name: string
  scoutCount: number
  averageProgress: number
}

export interface ForemanDetails {
  id: string
  name: string
  email: string
  groups: GroupWithStats[]
}

export interface LiaisonStats {
  id: string
  name: string
  email: string
  picture?: string
  foremanCount: number
  totalScouts: number
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  findByRole(role: Role): Promise<User[]>
  findLiaisonsWithStats(): Promise<LiaisonStats[]>
  findForemanWithGroups(foremanId: string): Promise<ForemanDetails | null>
  create(data: Partial<UserSchema>): Promise<User>
  save(user: Partial<User>): Promise<User>
  update(email: string, userData: Partial<User>): Promise<User>
}
