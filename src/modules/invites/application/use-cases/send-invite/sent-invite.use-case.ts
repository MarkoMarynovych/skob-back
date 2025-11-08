import { ForbiddenException, Inject, Injectable, InternalServerErrorException, Logger, NotImplementedException, NotFoundException } from "@nestjs/common"
import { UserMapper } from "~modules/invites/domain/mappers/user.mapper"
import { IInvitesRepository } from "~modules/invites/domain/repositories/invites.repository.interface"
import { InvitesDiToken } from "~modules/invites/infrastructure/constants/invites-constants"
import { Role } from "~modules/users/application/enums/role.enum"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { SharedInfrastructureDiToken } from "~shared/infrastructure/constants/shared-infrastructure-constants"
import { HashService } from "~shared/infrastructure/services/generate-hash/hash.service"
import { ISendInvitationService } from "../../services/send-invitation.service"

export interface ISendInvitePayload {
  email: string
  foremanEmail: string
}

@Injectable()
export class SendInviteUseCase implements IUseCase<ISendInvitePayload, void> {
  private readonly logger = new Logger(SendInviteUseCase.name)

  constructor(
    @Inject(UserDiToken.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(InvitesDiToken.INVITES_REPOSITORY)
    private readonly invitesRepository: IInvitesRepository,
    @Inject(InvitesDiToken.SEND_INVITATION_SERVICE)
    private readonly sendInvitationService: ISendInvitationService,
    @Inject(SharedInfrastructureDiToken.HASH_SERVICE)
    private readonly hashService: HashService
  ) {}

  public async execute(input: ISendInvitePayload): Promise<void> {
    throw new NotImplementedException("Email-based invitations have been deprecated. Please use the new invite link system.")
  }
}
