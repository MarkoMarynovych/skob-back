import { Module } from "@nestjs/common"
import { GetScoutByForemanEmailUseCase } from "./application/use-cases/get-scout-by-foreman-email/get-scout-by-foreman-email.use-case"
import { GetUserUseCase } from "./application/use-cases/get-user/get-user.use-case"
import { RemoveScoutFromGroupUseCase } from "./application/use-cases/remove-scout-from-group/remove-scout-from-group.use-case"
import { UpdateUserUseCase } from "./application/use-cases/update-user/update-user.use-case"
import { UserMapper } from "./domain/mappers/user/user.mapper"
import { UserDiToken } from "./infrastructure/constants/user-constants"
import { UsersController } from "./infrastructure/controllers/user-controller/users.controller"
import { UserRepository } from "./infrastructure/repositories/user.repository"

@Module({
  controllers: [UsersController],
  providers: [
    UserMapper,
    { provide: UserDiToken.GET_USER_USE_CASE, useClass: GetUserUseCase },
    { provide: UserDiToken.UPDATE_USER_USE_CASE, useClass: UpdateUserUseCase },
    { provide: UserDiToken.USER_REPOSITORY, useClass: UserRepository },
    { provide: UserDiToken.GET_SCOUT_BY_FOREMAN_EMAIL_USE_CASE, useClass: GetScoutByForemanEmailUseCase },
    { provide: UserDiToken.REMOVE_SCOUT_FROM_GROUP_USE_CASE, useClass: RemoveScoutFromGroupUseCase },
  ],
  exports: [],
})
export class UsersModule {}
