import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { v4 as uuidv4 } from "uuid"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { CreateGroupDto } from "../dto/create-group.dto"

interface CreateGroupInput {
  dto: CreateGroupDto
  ownerId: string
}

@Injectable()
export class CreateGroupUseCase implements IUseCase<CreateGroupInput, any> {
  constructor(
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    @Inject(UserDiToken.USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: CreateGroupInput): Promise<any> {
    const owner = await this.userRepository.findById(input.ownerId)

    if (!owner) {
      throw new NotFoundException(`User with ID ${input.ownerId} not found`)
    }

    const existingGroups = await this.groupRepository.findByOwnerId(input.ownerId)

    if (existingGroups.length >= 2) {
      throw new BadRequestException("You can only create up to 2 groups")
    }

    const inviteToken = uuidv4()
    const group = await this.groupRepository.create(input.dto.name, owner as any, inviteToken)

    return {
      id: group.id,
      name: group.name,
      ownerId: owner.id,
      inviteToken: group.inviteToken,
    }
  }
}
