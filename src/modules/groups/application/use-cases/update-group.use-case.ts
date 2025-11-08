import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"
import { UpdateGroupDto } from "../dto/update-group.dto"

export interface UpdateGroupPayload {
  groupId: string
  userId: string
  dto: UpdateGroupDto
}

@Injectable()
export class UpdateGroupUseCase implements IUseCase<UpdateGroupPayload, void> {
  constructor(
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository
  ) {}

  async execute(input: UpdateGroupPayload): Promise<void> {
    const group = await this.groupRepository.findById(input.groupId)

    if (!group) {
      throw new NotFoundException(`Group with id ${input.groupId} not found`)
    }

    if (group.owner.id !== input.userId) {
      throw new ForbiddenException("You can only update groups you own")
    }

    await this.groupRepository.update(input.groupId, { name: input.dto.name })
  }
}
