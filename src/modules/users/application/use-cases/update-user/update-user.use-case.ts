import { ForbiddenException, Injectable } from "@nestjs/common"
import { User } from "~modules/users/domain/entities/user.entity"
import { UserRepository } from "~modules/users/infrastructure/repositories/user.repository"
@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(updateData: Partial<User>, targetEmail: string, requestEmail: string): Promise<User> {
    if (targetEmail !== requestEmail) {
      throw new ForbiddenException("Cannot update other user's data")
    }
    return await this.userRepository.update(targetEmail, updateData)
  }
}
