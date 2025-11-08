import { BadRequestException, Inject, Injectable, NotFoundException, NotImplementedException } from "@nestjs/common"
import { AuthDiToken } from "~modules/auth/constants"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"
import { IInvitesRepository } from "~modules/invites/domain/repositories/invites.repository.interface"
import { InvitesDiToken } from "~modules/invites/infrastructure/constants/invites-constants"
import { CreateUserProbaUseCase } from "~modules/proba/application/use-cases/create-user-proba/create-user-proba.use-case"
import { IRoleRepository, RoleDITokens } from "~modules/roles/domain/repositories/role.repository.interface"
import { Role } from "~modules/users/application/enums/role.enum"
import { User } from "~modules/users/domain/entities/user.entity"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"

interface IAcceptInvitePayload {
  hash: string
}

@Injectable()
export class AcceptInviteUseCase implements IUseCase<IAcceptInvitePayload, void> {
  constructor(
    @Inject(UserDiToken.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(InvitesDiToken.INVITES_REPOSITORY) private readonly invitesRepository: IInvitesRepository,
    @Inject(RoleDITokens.ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    @Inject(GroupDITokens.GROUP_REPOSITORY) private readonly groupRepository: IGroupRepository,
    @Inject(AuthDiToken.CREATE_USER_PROBA_USE_CASE)
    private readonly createUserProbaUseCase: CreateUserProbaUseCase
  ) {}

  public async execute(input: IAcceptInvitePayload): Promise<void> {
    throw new NotImplementedException("Email-based invitations have been deprecated. Please use the new invite link system.")
  }
}
