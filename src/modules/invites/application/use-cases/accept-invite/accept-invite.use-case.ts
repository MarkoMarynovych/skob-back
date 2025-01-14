import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { hash } from "crypto"
import { IInvitesRepository } from "~modules/invites/domain/repositories/invites.repository.interface"
import { InvitesDiToken } from "~modules/invites/infrastructure/constants/invites-constants"
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
    @Inject(InvitesDiToken.INVITES_REPOSITORY) private readonly invitesRepository: IInvitesRepository
  ) {}

  public async execute(input: IAcceptInvitePayload): Promise<void> {
    const invite = await this.invitesRepository.findOne(input.hash)

    if (!invite) {
      throw new NotFoundException(`invite with hash ${hash} not found`)
    }

    if (invite.expired_at && invite.expired_at < new Date()) {
      throw new BadRequestException(`This invite has expired`)
    }

    if (invite.status) {
      throw new BadRequestException(`This invite has already been used`)
    }

    console.log("Processing invite:", { hash: input.hash, invite })

    await this.userRepository.addUserToGroup(invite.scout.id, invite.foreman.id)

    await this.invitesRepository.save({
      ...invite,
      status: true,
    })
  }
}
