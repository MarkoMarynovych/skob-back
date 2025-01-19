import { Inject, Injectable } from "@nestjs/common"
import { IProbaRepository, ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"

@Injectable()
export class CreateUserProbaUseCase {
  constructor(
    @Inject(ProbaDITokens.PROBA_REPOSITORY)
    private readonly probaRepository: IProbaRepository
  ) {}

  async execute(userId: string): Promise<void> {
    await this.probaRepository.initializeUserProbas(userId)
  }
}
