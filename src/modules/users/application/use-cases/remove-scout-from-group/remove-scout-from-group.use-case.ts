import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"

export interface IRemoveScoutFromGroupPayload {
  foremanEmail: string
  scoutEmail: string
}

@Injectable()
export class RemoveScoutFromGroupUseCase implements IUseCase<IRemoveScoutFromGroupPayload, void> {
  constructor(
    @Inject("USER_REPOSITORY")
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: IRemoveScoutFromGroupPayload): Promise<void> {
    try {
      await this.userRepository.removeScoutFromForeman(input.scoutEmail, input.foremanEmail)
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error
      }
      throw new Error(`Failed to remove scout from group: ${error.message}`)
    }
  }
}
