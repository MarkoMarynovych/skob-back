import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { UserDto } from "../../dto/user.dto"

export interface IGetScoutByForemanEmailPayload {
  foremanEmail: string
}

@Injectable()
export class GetScoutByForemanEmailUseCase implements IUseCase<IGetScoutByForemanEmailPayload, UserDto[]> {
  constructor(
    @Inject("USER_REPOSITORY")
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: IGetScoutByForemanEmailPayload): Promise<UserDto[]> {
    try {
      const scoutsUser = await this.userRepository.findScoutsByForemanEmail(input.foremanEmail)

      if (!scoutsUser) {
        throw new NotFoundException(`Scouts for ${input.foremanEmail} not found`)
      }

      return scoutsUser
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error
      }
      throw new Error(`Failed to get scouts: ${error.message}`)
    }
  }
}
