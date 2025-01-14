import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { AuthGuard } from "~modules/auth/infrastructure/guards/google-oauth2/google-oauth2.guard"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { UserRepository } from "~modules/users/infrastructure/repositories/user.repository"
import { AuthenticateUserUseCase } from "./application/use-cases/google-authenticate.use-case"
import { AuthDiToken } from "./constants"
import { CreateUserMapper } from "./domain/mappers/create-user.mapper"
import { AuthController } from "./infrastructure/controllers/google-oauth2/google-oauth2.controller"
import { GoogleStrategy } from "./strategy/google.strategy"
@Module({
  imports: [
    PassportModule,
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
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [],
})
export class AuthModule {}
