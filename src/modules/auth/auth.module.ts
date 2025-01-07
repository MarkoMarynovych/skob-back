import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { UserRepository } from "~modules/users/infrastructure/repositories/user.repository"
import { DatabaseModule } from "~shared/infrastructure/database/database.module"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { UsersModule } from "../users/users.module"
import { AuthenticateUserUseCase } from "./application/use-cases/google-authenticate.use-case"
import { AuthDiToken } from "./constants"
import { CreateUserMapper } from "./domain/mappers/create-user.mapper"
import { AuthController } from "./infrastructure/controllers/google-oauth2/google-oauth2.controller"
import { GoogleStrategy } from "./strategy/google.strategy"

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([UserSchema]),
    JwtModule.register({
      global: true,
      secret: "secret",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    CreateUserMapper,
    { provide: AuthDiToken.AUTHENTICATE_USER_USE_CASE, useClass: AuthenticateUserUseCase },
    { provide: UserDiToken.USER_REPOSITORY, useClass: UserRepository },
  ],
  exports: [],
})
export class AuthModule {}
