import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "~modules/users/domain/entities/user.entity"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly usersRepository: Repository<UserSchema>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
    })
  }

  async save(user: Partial<User>): Promise<User> {
    const savedUser = await this.usersRepository.save(user)
    return savedUser
  }

  async update(email: string, userData: Partial<User>): Promise<User> {
    const user = await this.findByEmail(email)

    if (!user) {
      throw new Error("User not found")
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...userData,
    })

    return updatedUser
  }

  async findScoutsByForemanEmail(foremanEmail: string): Promise<User[]> {
    throw new Error("Not implemented")
  }

  async removeScoutFromForeman(scoutEmail: string, foremanEmail: string): Promise<void> {
    throw new Error("Not implemented")
  }
}
