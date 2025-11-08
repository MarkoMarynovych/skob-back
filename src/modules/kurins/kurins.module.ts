import { Module, forwardRef } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersModule } from "~modules/users/users.module"
import { KurinSchema } from "~shared/infrastructure/database/postgres/schemas/kurin.schema"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { GroupSchema } from "~shared/infrastructure/database/postgres/schemas/group.schema"
import { GroupMembershipSchema } from "~shared/infrastructure/database/postgres/schemas/group-membership.schema"
import { RoleSchema } from "~shared/infrastructure/database/postgres/schemas/role.schema"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"
import { CreateKurinUseCase } from "./application/use-cases/create-kurin.use-case"
import { GetKurinsUseCase } from "./application/use-cases/get-kurins.use-case"
import { GetKurinUseCase } from "./application/use-cases/get-kurin.use-case"
import { UpdateKurinUseCase } from "./application/use-cases/update-kurin.use-case"
import { DeleteKurinUseCase } from "./application/use-cases/delete-kurin.use-case"
import { KurinDITokens } from "./domain/repositories/kurin.repository.interface"
import { KurinDiTokens } from "./infrastructure/controllers/kurins.controller"
import { KurinsController } from "./infrastructure/controllers/kurins.controller"
import { KurinRepository } from "./infrastructure/repositories/kurin.repository"
import { KurinAccessGuard } from "~modules/common/guards/kurin-access.guard"

@Module({
  imports: [
    TypeOrmModule.forFeature([KurinSchema, UserSchema, GroupSchema, GroupMembershipSchema, RoleSchema, UserProbaProgressSchema]),
    forwardRef(() => UsersModule),
    forwardRef(() => require("../groups/groups.module").GroupsModule),
  ],
  controllers: [KurinsController],
  providers: [
    KurinAccessGuard,
    {
      provide: KurinDITokens.KURIN_REPOSITORY,
      useClass: KurinRepository,
    },
    {
      provide: KurinDiTokens.CREATE_KURIN_USE_CASE,
      useClass: CreateKurinUseCase,
    },
    {
      provide: KurinDiTokens.GET_KURINS_USE_CASE,
      useClass: GetKurinsUseCase,
    },
    {
      provide: KurinDiTokens.GET_KURIN_USE_CASE,
      useClass: GetKurinUseCase,
    },
    {
      provide: KurinDiTokens.UPDATE_KURIN_USE_CASE,
      useClass: UpdateKurinUseCase,
    },
    {
      provide: KurinDiTokens.DELETE_KURIN_USE_CASE,
      useClass: DeleteKurinUseCase,
    },
  ],
  exports: [KurinDITokens.KURIN_REPOSITORY],
})
export class KurinsModule {}
