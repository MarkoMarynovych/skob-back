import { Body, Controller, Get, Inject, Param, Patch } from "@nestjs/common"
import { IProbaRepository, ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"
import { SignEntireProbaDto } from "../../application/dto/sign-entire-proba.dto"
import { UpdateProbaDto } from "../../application/dto/update-proba.dto"
import { SignEntireProbaUseCase } from "../../application/use-cases/sign-entire-proba/sign-entire-proba.use-case"
import { UpdateProbaUseCase } from "../../application/use-cases/update-proba/update-proba.use-case"

@Controller("probas")
export class ProbaController {
  constructor(
    @Inject(ProbaDITokens.UPDATE_PROBA_USE_CASE)
    private readonly updateProbaUseCase: UpdateProbaUseCase,
    @Inject(ProbaDITokens.SIGN_ENTIRE_PROBA_USE_CASE)
    private readonly signEntireProbaUseCase: SignEntireProbaUseCase,
    @Inject(ProbaDITokens.PROBA_REPOSITORY)
    private readonly probaRepository: IProbaRepository
  ) {}

  @Get(":userId")
  async getUserProbas(@Param("userId") userId: string) {
    return this.probaRepository.getUserProbaProgressView(userId)
  }

  @Patch("item")
  async signProbaItem(@Body() dto: UpdateProbaDto): Promise<void> {
    await this.updateProbaUseCase.execute(dto)
  }

  @Patch("entire")
  async signEntireProba(@Body() dto: SignEntireProbaDto): Promise<void> {
    await this.signEntireProbaUseCase.execute(dto)
  }
}
