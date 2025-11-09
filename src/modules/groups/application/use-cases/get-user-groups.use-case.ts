import { Inject, Injectable, Logger } from "@nestjs/common"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"
import { IProbaRepository, ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"

interface GetUserGroupsInput {
  userId: string
}

@Injectable()
export class GetUserGroupsUseCase implements IUseCase<GetUserGroupsInput, any[]> {
  private readonly logger = new Logger(GetUserGroupsUseCase.name)

  constructor(
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    @Inject(ProbaDITokens.PROBA_REPOSITORY)
    private readonly probaRepository: IProbaRepository
  ) {}

  async execute(input: GetUserGroupsInput): Promise<any[]> {
    // Get all groups where the user is the owner
    const ownedGroups = await this.groupRepository.findByOwnerId(input.userId)

    // Get all groups where the user is a member
    const memberGroups = await this.groupRepository.findByMemberId(input.userId)

    // Combine and deduplicate groups (in case user is both owner and member)
    const allGroups = [...ownedGroups]
    memberGroups.forEach((memberGroup) => {
      if (!allGroups.find((g) => g.id === memberGroup.id)) {
        allGroups.push(memberGroup)
      }
    })

    // Map groups and include scout information with proba progress
    const groupsWithScouts = await Promise.all(
      allGroups.map(async (group) => {
        const scouts = await Promise.all(
          (group.memberships || []).map(async (membership) => {
            const user = membership.user

            // Get proba progress for this user
            let completedProbasCount = 0
            let totalProbasCount = 0

            try {
              const probaProgress = await this.probaRepository.getUserProbaProgress(user.id)

              // Count completed vs total proba items from all proba levels
              const allProbas = [probaProgress.zeroProba, probaProgress.firstProba, probaProgress.secondProba]

              allProbas.forEach((proba) => {
                Object.values(proba).forEach((items) => {
                  items.forEach((item) => {
                    totalProbasCount++
                    if (item.is_completed) {
                      completedProbasCount++
                    }
                  })
                })
              })
            } catch (error) {
              this.logger.error(`Failed to fetch proba progress for user ${user.id}:`, error)
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              picture: user.picture || null,
              completedProbasCount,
              totalProbasCount,
            }
          })
        )

        return {
          id: group.id,
          name: group.name,
          ownerId: group.owner.id,
          scouts,
        }
      })
    )

    return groupsWithScouts
  }
}
