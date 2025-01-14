import { User } from "../entities/user.entity"

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  save(user: Partial<User>): Promise<User>
  update(email: string, userData: Partial<User>): Promise<User>
  findScoutsByForemanEmail(foremanEmail: string): Promise<User[]>
  isUserForeman(foremanEmail: string, scoutEmail: string): Promise<boolean>
  removeScoutFromForeman(scoutEmail: string, foremanEmail: string): Promise<void>
  validateUserUpdatePermission(userEmailToUpdate: string, requestUserEmail: string): Promise<void>
  addUserToGroup(scoutEmail: string, foremanEmail: string): Promise<void>
}
