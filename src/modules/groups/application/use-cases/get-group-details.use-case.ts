import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { IGroupRepository, GroupDITokens, GroupDetails } from "~modules/groups/domain/repositories/group.repository.interface"

interface GetGroupDetailsInput {
  groupId: string
}

@Injectable()
export class GetGroupDetailsUseCase implements IUseCase<GetGroupDetailsInput, GroupDetails> {
  constructor(
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository
  ) {}

  async execute(input: GetGroupDetailsInput): Promise<GroupDetails> {
    const group = await this.groupRepository.findByIdWithScouts(input.groupId)

    if (!group) {
      throw new NotFoundException(`Group with ID ${input.groupId} not found`)
    }

    return group
  }
}
