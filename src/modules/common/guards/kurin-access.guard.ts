import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IKurinRepository, KurinDITokens } from "~modules/kurins/domain/repositories/kurin.repository.interface"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"
import { Role } from "~modules/users/application/enums/role.enum"

@Injectable()
export class KurinAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(UserDiToken.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(KurinDITokens.KURIN_REPOSITORY)
    private readonly kurinRepository: IKurinRepository,
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      return false
    }

    if (user.role === Role.ADMIN) {
      return true
    }

    if (user.role === Role.LIAISON) {
      const currentUser = await this.userRepository.findById(user.sub)

      if (!currentUser || !currentUser.kurin) {
        throw new ForbiddenException("Liaison must be assigned to a Kurin")
      }

      const kurinId = request.params.kurinId || request.params.id
      const foremanId = request.params.foremanId
      const groupId = request.params.groupId

      if (kurinId) {
        if (currentUser.kurin.id !== kurinId) {
          throw new ForbiddenException("You can only access data within your own Kurin")
        }
        return true
      }

      if (foremanId) {
        const foreman = await this.userRepository.findById(foremanId)
        if (!foreman || !foreman.kurin || foreman.kurin.id !== currentUser.kurin.id) {
          throw new ForbiddenException("You can only access Foremen within your own Kurin")
        }
        return true
      }

      if (groupId) {
        const group = await this.groupRepository.findById(groupId)
        if (!group) {
          throw new ForbiddenException("Group not found")
        }

        const groupOwner = await this.userRepository.findById(group.owner.id)
        if (!groupOwner || !groupOwner.kurin || groupOwner.kurin.id !== currentUser.kurin.id) {
          throw new ForbiddenException("You can only access Groups within your own Kurin")
        }
        return true
      }
    }

    return true
  }
}
