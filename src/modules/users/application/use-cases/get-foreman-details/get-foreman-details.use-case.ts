import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { ForemanDetails } from "~modules/users/domain/repositories/user.repository.interface"

interface GetForemanDetailsInput {
  foremanId: string
}

@Injectable()
export class GetForemanDetailsUseCase implements IUseCase<GetForemanDetailsInput, ForemanDetails> {
  constructor(
    @Inject(UserDiToken.USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: GetForemanDetailsInput): Promise<ForemanDetails> {
    const foreman = await this.userRepository.findForemanWithGroups(input.foremanId)

    if (!foreman) {
      throw new NotFoundException(`Foreman with ID ${input.foremanId} not found`)
    }

    return foreman
  }
}
