import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { User } from "~modules/users/domain/entities/user.entity"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserMapper } from "~modules/users/domain/mappers/user/user.mapper"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { UserDto } from "../../dto/user.dto"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"

export interface IUpdateUserPayload {
  updateData: Partial<User>
  targetEmail: string
  requestEmail: string
}

@Injectable()
export class UpdateUserUseCase implements IUseCase<IUpdateUserPayload, UserDto> {
  constructor(
    @Inject(UserDiToken.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    private readonly userMapper: UserMapper
  ) {}

  async execute(input: IUpdateUserPayload): Promise<UserDto> {
    try {
      const isSelfUpdate = input.targetEmail === input.requestEmail

      if (!isSelfUpdate) {
        const requestUser = await this.userRepository.findByEmail(input.requestEmail)
        const targetUser = await this.userRepository.findByEmail(input.targetEmail)

        if (!requestUser || !targetUser) {
          throw new NotFoundException("User not found")
        }

        const isForeman = await this.groupRepository.isOwnerOfUserGroup(requestUser.id, targetUser.id)

        if (!isForeman) {
          throw new ForbiddenException("You can only update your own profile or profiles of scouts in your groups")
        }
      }

      const updatedUser = await this.userRepository.update(input.targetEmail, input.updateData)

      if (!updatedUser) {
        throw new NotFoundException(`User with email ${input.targetEmail} not found`)
      }

      return this.userMapper.toDto(updatedUser)
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error
      }
      throw new Error(`Failed to update user: ${error.message}`)
    }
  }
}
