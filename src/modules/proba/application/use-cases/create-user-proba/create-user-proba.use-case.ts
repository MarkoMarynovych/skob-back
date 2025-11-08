import { Inject, Injectable } from "@nestjs/common"
import { IProbaRepository, ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"

@Injectable()
export class CreateUserProbaUseCase implements IUseCase<string, void> {
  constructor(
    @Inject(ProbaDITokens.PROBA_REPOSITORY)
    private readonly probaRepository: IProbaRepository,
    @Inject(UserDiToken.USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<void> {
    console.log('[CreateUserProbaUseCase] Starting execution for userId:', userId)
    const user = await this.userRepository.findById(userId)
    console.log('[CreateUserProbaUseCase] Found user:', user)

    if (!user || !user.sex) {
      console.log('[CreateUserProbaUseCase] User has no gender, returning early')
      // If user has no gender, we cannot initialize probas.
      // This is expected if they haven't completed onboarding.
      return
    }

    console.log('[CreateUserProbaUseCase] Calling initializeUserProbas with gender:', user.sex)
    await this.probaRepository.initializeUserProbas(user.id, user.sex)
    console.log('[CreateUserProbaUseCase] Successfully initialized probas')
  }
}
