import { Module, forwardRef } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersModule } from "~modules/users/users.module"
import { ProbaItemTemplateSchema } from "~shared/infrastructure/database/postgres/schemas/proba-item-template.schema"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { AssignProbaUseCase } from "./application/use-cases/assign-proba/assign-proba.use-case"
import { CreateUserProbaUseCase } from "./application/use-cases/create-user-proba/create-user-proba.use-case"
import { SignEntireProbaUseCase } from "./application/use-cases/sign-entire-proba/sign-entire-proba.use-case"
import { UpdateProbaUseCase } from "./application/use-cases/update-proba/update-proba.use-case"
import { ProbaDITokens } from "./domain/repositories/proba.repository.interface"
import { ProbaController } from "./infrastructure/controllers/proba.controller"
import { ProbaRepository } from "./infrastructure/repositories/proba.repository"
import { ProbaProgressMapper } from "./domain/mappers/proba-progress.mapper"

@Module({
  imports: [
    TypeOrmModule.forFeature([ProbaItemTemplateSchema, UserProbaProgressSchema, UserSchema]),
    forwardRef(() => UsersModule),
    forwardRef(() => require("../groups/groups.module").GroupsModule),
  ],
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
      provide: ProbaDITokens.ASSIGN_PROBA_USE_CASE,
      useClass: AssignProbaUseCase,
    },
    {
      provide: ProbaDITokens.CREATE_USER_PROBA_USE_CASE,
      useClass: CreateUserProbaUseCase,
    },
    {
      provide: ProbaDITokens.PROBA_REPOSITORY,
      useClass: ProbaRepository,
    },
    ProbaProgressMapper,
  ],
  exports: [ProbaDITokens.PROBA_REPOSITORY],
})
export class ProbasModule {}
