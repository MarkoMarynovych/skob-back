import { Module } from "@nestjs/common"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { UserRepository } from "~modules/users/infrastructure/repositories/user.repository"
import { SignEntireProbaUseCase } from "./application/use-cases/sign-entire-proba/sign-entire-proba.use-case"
import { UpdateProbaUseCase } from "./application/use-cases/update-proba/update-proba.use-case"
import { ProbaDITokens } from "./domain/repositories/proba.repository.interface"
import { ProbaController } from "./infrastructure/controllers/proba.controller"
import { ProbaRepository } from "./infrastructure/repositories/proba.repository"
import { ProbaProgressMapper } from "./domain/mappers/proba-progress.mapper"

@Module({
  controllers: [ProbaController],
  providers: [
    {
      provide: ProbaDITokens.UPDATE_PROBA_USE_CASE,
      useClass: UpdateProbaUseCase,
    },
    {
      provide: ProbaDITokens.SIGN_ENTIRE_PROBA_USE_CASE,
      useClass: SignEntireProbaUseCase,
    },
    {
      provide: ProbaDITokens.PROBA_REPOSITORY,
      useClass: ProbaRepository,
    },
    { provide: UserDiToken.USER_REPOSITORY, useClass: UserRepository },
    ProbaProgressMapper,
  ],
})
export class ProbasModule {}
