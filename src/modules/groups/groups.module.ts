import { Module, forwardRef } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersModule } from "~modules/users/users.module"
import { GroupSchema } from "~shared/infrastructure/database/postgres/schemas/group.schema"
import { GroupMembershipSchema } from "~shared/infrastructure/database/postgres/schemas/group-membership.schema"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"
import { AddMemberUseCase } from "./application/use-cases/add-member.use-case"
import { RemoveMemberUseCase } from "./application/use-cases/remove-member.use-case"
import { CreateGroupUseCase } from "./application/use-cases/create-group.use-case"
import { UpdateGroupUseCase } from "./application/use-cases/update-group.use-case"
import { GetUserGroupsUseCase } from "./application/use-cases/get-user-groups.use-case"
import { GetInviteLinkUseCase } from "./application/use-cases/get-invite-link.use-case"
import { GetGroupDetailsUseCase } from "./application/use-cases/get-group-details.use-case"
import { GroupDITokens } from "./domain/repositories/group.repository.interface"
import { GroupDiTokens } from "./infrastructure/controllers/groups.controller"
import { GroupsController } from "./infrastructure/controllers/groups.controller"
import { GroupRepository } from "./infrastructure/repositories/group.repository"
import { KurinAccessGuard } from "~modules/common/guards/kurin-access.guard"

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupSchema, GroupMembershipSchema, UserSchema, UserProbaProgressSchema]),
    forwardRef(() => UsersModule),
    forwardRef(() => require("../kurins/kurins.module").KurinsModule),
    forwardRef(() => require("../proba/probas.module").ProbasModule),
  ],
  controllers: [GroupsController],
  providers: [
    KurinAccessGuard,
    {
      provide: GroupDITokens.GROUP_REPOSITORY,
      useClass: GroupRepository,
    },
    {
      provide: GroupDiTokens.CREATE_GROUP_USE_CASE,
      useClass: CreateGroupUseCase,
    },
    {
      provide: GroupDiTokens.ADD_MEMBER_USE_CASE,
      useClass: AddMemberUseCase,
    },
    {
      provide: GroupDiTokens.REMOVE_MEMBER_USE_CASE,
      useClass: RemoveMemberUseCase,
    },
    {
      provide: GroupDiTokens.UPDATE_GROUP_USE_CASE,
      useClass: UpdateGroupUseCase,
    },
    {
      provide: GroupDiTokens.GET_USER_GROUPS_USE_CASE,
      useClass: GetUserGroupsUseCase,
    },
    {
      provide: GroupDiTokens.GET_INVITE_LINK_USE_CASE,
      useClass: GetInviteLinkUseCase,
    },
    {
      provide: GroupDiTokens.GET_GROUP_DETAILS_USE_CASE,
      useClass: GetGroupDetailsUseCase,
    },
  ],
  exports: [GroupDITokens.GROUP_REPOSITORY],
})
export class GroupsModule {}
