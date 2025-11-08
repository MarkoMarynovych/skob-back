import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthGuard } from "~modules/auth/infrastructure/guards/google-oauth2/google-oauth2.guard"
import { ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"
import { ProbaRepository } from "~modules/proba/infrastructure/repositories/proba.repository"
import { RolesModule } from "~modules/roles/roles.module"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { UserRepository } from "~modules/users/infrastructure/repositories/user.repository"
import { UserMapper } from "~modules/users/domain/mappers/user/user.mapper"
import { ProbaItemTemplateSchema } from "~shared/infrastructure/database/postgres/schemas/proba-item-template.schema"
import { ProbaTemplateSchema } from "~shared/infrastructure/database/postgres/schemas/proba-template.schema"
import { RoleSchema } from "~shared/infrastructure/database/postgres/schemas/role.schema"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { AuthenticateUserUseCase } from "./application/use-cases/google-authenticate.use-case"
import { AuthDiToken } from "./constants"
import { CreateUserMapper } from "./domain/mappers/create-user.mapper"
import { AuthController } from "./infrastructure/controllers/google-oauth2/google-oauth2.controller"
import { GoogleStrategy } from "./infrastructure/strategy/google.strategy"

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([ProbaTemplateSchema, ProbaItemTemplateSchema, UserProbaProgressSchema, UserSchema, RoleSchema]),
    RolesModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    CreateUserMapper,
    UserMapper,
    { provide: "AUTH_GUARD", useClass: AuthGuard }, // Provide with token for useExisting
    { provide: AuthDiToken.AUTHENTICATE_USER_USE_CASE, useClass: AuthenticateUserUseCase },
    { provide: UserDiToken.USER_REPOSITORY, useClass: UserRepository },
    { provide: ProbaDITokens.PROBA_REPOSITORY, useClass: ProbaRepository },
  ],
  exports: ["AUTH_GUARD"],
})
export class AuthModule {}
