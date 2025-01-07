import { Module } from "@nestjs/common"
import { GetUserUseCase } from "./application/use-cases/get-user/get-user.use-case"
import { UserMapper } from "./domain/mappers/user/user.mapper"
import { UserDiToken } from "./infrastructure/constants/user-constants"
import { UsersController } from "./infrastructure/controllers/user-controller/users.controller"
import { UserRepository } from "./infrastructure/repositories/user.repository"

@Module({
  // imports: [DatabaseModule, TypeOrmModule.forFeature([UserSchema])],
  controllers: [UsersController],
  providers: [
    UserMapper,
    { provide: UserDiToken.GET_USER_USE_CASE, useClass: GetUserUseCase },
    // { provide: UserDiToken.UPDATE_USER_USE_CASE, useClass: UpdateUserUseCase },
    { provide: UserDiToken.USER_REPOSITORY, useClass: UserRepository },
  ],
  exports: [],
})
export class UsersModule {}
