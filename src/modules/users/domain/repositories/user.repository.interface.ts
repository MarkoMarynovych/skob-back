import { User } from "../entities/user.entity"

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  save(user: Partial<User>): Promise<User>
  update(email: string, userData: Partial<User>): Promise<User>
  findScoutsByForemanEmail(foremanEmail: string): Promise<User[]>
  removeScoutFromForeman(scoutEmail: string, foremanEmail: string): Promise<void>
}
