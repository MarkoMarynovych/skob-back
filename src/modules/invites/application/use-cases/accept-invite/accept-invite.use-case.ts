import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { AuthDiToken } from "~modules/auth/constants"
import { IInvitesRepository } from "~modules/invites/domain/repositories/invites.repository.interface"
import { InvitesDiToken } from "~modules/invites/infrastructure/constants/invites-constants"
import { CreateUserProbaUseCase } from "~modules/proba/application/use-cases/create-user-proba/create-user-proba.use-case"
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
    @Inject(AuthDiToken.CREATE_USER_PROBA_USE_CASE)
    private readonly createUserProbaUseCase: CreateUserProbaUseCase
  ) {}

  public async execute(input: IAcceptInvitePayload): Promise<void> {
    const invite = await this.invitesRepository.findOne(input.hash)

    if (!invite) {
      throw new NotFoundException(`invite with hash ${input.hash} not found`)
    }

    if (invite.expired_at && invite.expired_at < new Date()) {
      throw new BadRequestException(`This invite has expired`)
    }

    if (invite.status) {
      throw new BadRequestException(`This invite has already been used`)
    }

    console.log("Processing invite:", { hash: input.hash, invite })

    await this.userRepository.addUserToGroup(invite.scout.id, invite.foreman.id)

    await this.createUserProbaUseCase.execute(invite.scout.id)
    console.log("Initialized probas for scout:", invite.scout.id)

    await this.invitesRepository.save({
      ...invite,
      status: true,
    })
  }
}
