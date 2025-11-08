import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"

interface RemoveMemberInput {
  groupId: string
  userIdToRemove: string
  currentUserId: string
}

@Injectable()
export class RemoveMemberUseCase implements IUseCase<RemoveMemberInput, void> {
  constructor(
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository
  ) {}

  async execute(input: RemoveMemberInput): Promise<void> {
    const group = await this.groupRepository.findById(input.groupId)

    if (!group) {
      throw new NotFoundException(`Group with ID ${input.groupId} not found`)
    }

    // Verify current user is the owner
    if (group.owner.id !== input.currentUserId) {
      throw new ForbiddenException("Only the group owner can remove members")
    }

    await this.groupRepository.removeMember(input.groupId, input.userIdToRemove)
  }
}
