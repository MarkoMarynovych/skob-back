import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"
import { IProbaRepository, ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ProbaTemplateSchema } from "~shared/infrastructure/database/postgres/schemas/proba-template.schema"

interface JoinByTokenInput {
  inviteToken: string
  userId: string
}

export interface JoinByTokenOutput {
  groupId: string
  groupName: string
  message: string
}

@Injectable()
export class JoinByTokenUseCase implements IUseCase<JoinByTokenInput, JoinByTokenOutput> {
  constructor(
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    @Inject(UserDiToken.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ProbaDITokens.PROBA_REPOSITORY)
    private readonly probaRepository: IProbaRepository,
    @InjectRepository(ProbaTemplateSchema)
    private readonly probaTemplateRepository: Repository<ProbaTemplateSchema>
  ) {}

  async execute(input: JoinByTokenInput): Promise<JoinByTokenOutput> {
    const group = await this.groupRepository.findByInviteToken(input.inviteToken)

    if (!group) {
      throw new NotFoundException(`Invalid invite token`)
    }

    const isAlreadyMember = await this.groupRepository.isMember(group.id, input.userId)

    if (isAlreadyMember) {
      // User is already in the group. This is not an error - just return success.
      console.log(`[JoinByTokenUseCase] User ${input.userId} is already a member of group ${group.name}. Skipping join.`)
      return {
        groupId: group.id,
        groupName: group.name,
        message: `You are already a member of ${group.name}`,
      }
    }

    const isOwner = group.owner.id === input.userId

    if (isOwner) {
      // Owner is already implicitly part of the group
      console.log(`[JoinByTokenUseCase] User ${input.userId} is the owner of group ${group.name}. Skipping join.`)
      return {
        groupId: group.id,
        groupName: group.name,
        message: `You are the owner of ${group.name}`,
      }
    }

    await this.groupRepository.addMember(group.id, input.userId)

    await this.initializeUserProbas(input.userId)

    return {
      groupId: group.id,
      groupName: group.name,
      message: `Successfully joined ${group.name}`,
    }
  }

  private async initializeUserProbas(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId)

    if (!user || !user.sex) {
      return
    }

    const existingProgress = await this.probaRepository.getUserProbaProgress(userId)

    const hasProbasInitialized =
      Object.keys(existingProgress.zeroProba).length > 0 ||
      Object.keys(existingProgress.firstProba).length > 0 ||
      Object.keys(existingProgress.secondProba).length > 0

    if (hasProbasInitialized) {
      return
    }

    await this.probaRepository.initializeUserProbas(userId, user.sex)
  }
}
