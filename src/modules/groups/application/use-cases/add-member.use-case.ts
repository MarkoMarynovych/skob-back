import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"

interface AddMemberInput {
  groupId: string
  userIdToAdd: string
  currentUserId: string
}

@Injectable()
export class AddMemberUseCase implements IUseCase<AddMemberInput, void> {
  constructor(
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository
  ) {}

  async execute(input: AddMemberInput): Promise<void> {
    const group = await this.groupRepository.findById(input.groupId)

    if (!group) {
      throw new NotFoundException(`Group with ID ${input.groupId} not found`)
    }

    // Verify current user is the owner
    if (group.owner.id !== input.currentUserId) {
      throw new ForbiddenException("Only the group owner can add members")
    }

    await this.groupRepository.addMember(input.groupId, input.userIdToAdd)
  }
}
