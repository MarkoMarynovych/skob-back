import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"

interface GetInviteLinkInput {
  groupId: string
  userId: string
}

export interface GetInviteLinkOutput {
  inviteToken: string
}

@Injectable()
export class GetInviteLinkUseCase implements IUseCase<GetInviteLinkInput, GetInviteLinkOutput> {
  constructor(
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository
  ) {}

  async execute(input: GetInviteLinkInput): Promise<GetInviteLinkOutput> {
    const group = await this.groupRepository.findById(input.groupId)

    if (!group) {
      throw new NotFoundException(`Group with ID ${input.groupId} not found`)
    }

    const isOwner = group.owner.id === input.userId
    const isMember = await this.groupRepository.isMember(input.groupId, input.userId)

    if (!isOwner && !isMember) {
      throw new ForbiddenException(`You are not a member of this group`)
    }

    return {
      inviteToken: group.inviteToken,
    }
  }
}
