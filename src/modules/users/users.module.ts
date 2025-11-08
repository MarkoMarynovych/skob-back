import { Module, forwardRef } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"
import { ProbaRepository } from "~modules/proba/infrastructure/repositories/proba.repository"
import { RolesModule } from "~modules/roles/roles.module"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { GroupSchema } from "~shared/infrastructure/database/postgres/schemas/group.schema"
import { GroupMembershipSchema } from "~shared/infrastructure/database/postgres/schemas/group-membership.schema"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"
import { GetUserUseCase } from "./application/use-cases/get-user/get-user.use-case"
import { GetLiaisonsUseCase } from "./application/use-cases/get-liaisons/get-liaisons.use-case"
import { GetForemenUseCase } from "./application/use-cases/get-foremen/get-foremen.use-case"
import { GetForemanDetailsUseCase } from "./application/use-cases/get-foreman-details/get-foreman-details.use-case"
import { UpdateUserUseCase } from "./application/use-cases/update-user/update-user.use-case"
import { UserMapper } from "./domain/mappers/user/user.mapper"
import { UserDiToken } from "./infrastructure/constants/user-constants"
import { UsersController } from "./infrastructure/controllers/user-controller/users.controller"
import { UserRepository } from "./infrastructure/repositories/user.repository"
import { KurinAccessGuard } from "~modules/common/guards/kurin-access.guard"

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema, GroupSchema, GroupMembershipSchema, UserProbaProgressSchema]),
    RolesModule,
    forwardRef(() => require("../kurins/kurins.module").KurinsModule),
    forwardRef(() => require("../groups/groups.module").GroupsModule),
  ],
  controllers: [UsersController],
  providers: [
    KurinAccessGuard,
    UserMapper,
    { provide: UserDiToken.GET_USER_USE_CASE, useClass: GetUserUseCase },
    { provide: UserDiToken.GET_LIAISONS_USE_CASE, useClass: GetLiaisonsUseCase },
    { provide: UserDiToken.GET_FOREMEN_USE_CASE, useClass: GetForemenUseCase },
    { provide: UserDiToken.GET_FOREMAN_DETAILS_USE_CASE, useClass: GetForemanDetailsUseCase },
    { provide: UserDiToken.UPDATE_USER_USE_CASE, useClass: UpdateUserUseCase },
    { provide: UserDiToken.USER_REPOSITORY, useClass: UserRepository },
    {
      provide: ProbaDITokens.PROBA_REPOSITORY,
      useClass: ProbaRepository,
    },
  ],
  exports: [UserDiToken.USER_REPOSITORY],
})
export class UsersModule {}
