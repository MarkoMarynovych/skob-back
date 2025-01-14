import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { User } from "~modules/users/domain/entities/user.entity"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { UserDto } from "../../dto/user.dto"

export interface IUpdateUserPayload {
  updateData: Partial<User>
  targetEmail: string
  requestEmail: string
}

@Injectable()
export class UpdateUserUseCase implements IUseCase<IUpdateUserPayload, UserDto> {
  constructor(
    @Inject("USER_REPOSITORY")
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: IUpdateUserPayload): Promise<UserDto> {
    try {
      await this.userRepository.validateUserUpdatePermission(input.targetEmail, input.requestEmail)

      const updatedUser = await this.userRepository.update(input.targetEmail, input.updateData)

      if (!updatedUser) {
        throw new NotFoundException(`User with email ${input.targetEmail} not found`)
      }

      return updatedUser
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error
      }
      throw new Error(`Failed to update user: ${error.message}`)
    }
  }
}
