import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common"
import { UserMapper } from "~modules/invites/domain/mappers/user.mapper"
import { IInvitesRepository } from "~modules/invites/domain/repositories/invites.repository.interface"
import { InvitesDiToken } from "~modules/invites/infrastructure/constants/invites-constants"
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
    const scout = await this.userRepository.findByEmail(input.email)
    const foreman = await this.userRepository.findByEmail(input.foremanEmail)

    if (!scout || !foreman) {
      throw new NotFoundException("Scout or foreman not found")
    }

    const isAlreadyInGroup = await this.userRepository.isUserForeman(input.foremanEmail, input.email)
    if (isAlreadyInGroup) {
      throw new BadRequestException("Scout is already in foreman's group")
    }

    const hashedValues = this.hashService.createSHA256Hash(JSON.stringify({ scoutEmail: input.email, foremanEmail: input.foremanEmail, date: new Date() }))
    this.logger.log(`Hash: ${hashedValues}`)

    const invite = await this.invitesRepository.save({
      scout: UserMapper.toSchema(scout),
      foreman: UserMapper.toSchema(foreman),
      hash: hashedValues,
      status: false,
      expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    if (!invite) {
      this.logger.log(`Failed to save invite to database`)
      throw new InternalServerErrorException(`Failed to save invite to database`)
    }

    await this.sendInvitationService.sendInvitation({
      scoutEmail: input.email,
      inviteHash: invite.hash,
      scoutName: scout.name,
      foremanName: foreman.name,
    })
  }
}
