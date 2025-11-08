import { BullModule } from "@nestjs/bull"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthDiToken } from "~modules/auth/constants"
import { GroupsModule } from "~modules/groups/groups.module"
import { CreateUserProbaUseCase } from "~modules/proba/application/use-cases/create-user-proba/create-user-proba.use-case"
import { ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"
import { ProbaRepository } from "~modules/proba/infrastructure/repositories/proba.repository"
import { RolesModule } from "~modules/roles/roles.module"
import { UsersModule } from "~modules/users/users.module"
import { SharedInfrastructureDiToken } from "~shared/infrastructure/constants/shared-infrastructure-constants"
import { InviteSchema } from "~shared/infrastructure/database/postgres/schemas/invite.schema"
import { KurinSchema } from "~shared/infrastructure/database/postgres/schemas/kurin.schema"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { RoleSchema } from "~shared/infrastructure/database/postgres/schemas/role.schema"
import { ProbaTemplateSchema } from "~shared/infrastructure/database/postgres/schemas/proba-template.schema"
import { ProbaItemTemplateSchema } from "~shared/infrastructure/database/postgres/schemas/proba-item-template.schema"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"
import { FileService } from "~shared/infrastructure/services/file-service/file.service"
import { HashService } from "~shared/infrastructure/services/generate-hash/hash.service"
import { TemplateService } from "~shared/infrastructure/services/template-service/template.service"
import { AcceptInviteUseCase } from "./application/use-cases/accept-invite/accept-invite.use-case"
import { SendInviteUseCase } from "./application/use-cases/send-invite/sent-invite.use-case"
import { JoinByTokenUseCase } from "./application/use-cases/join-by-token/join-by-token.use-case"
import { GenerateInviteUseCase } from "./application/use-cases/generate-invite/generate-invite.use-case"
import { AcceptInviteV2UseCase } from "./application/use-cases/accept-invite/accept-invite-v2.use-case"
import { UserMapper } from "./domain/mappers/user.mapper"
import { InvitesDiToken } from "./infrastructure/constants/invites-constants"
import { InvitesController } from "./infrastructure/controllers/invite-controller/invites.controller"
import { InvitationQueueProcessor } from "./infrastructure/processors/invitation-queue.processor"
import { InvitesRepository } from "./infrastructure/repositories/invites.repository"
import { SendInvitationService } from "./infrastructure/services/send-invitation.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([InviteSchema, KurinSchema, UserSchema, RoleSchema, ProbaTemplateSchema, ProbaItemTemplateSchema, UserProbaProgressSchema]),
    BullModule.registerQueue({ name: "invitations" }),
    UsersModule,
    RolesModule,
    GroupsModule,
  ],
  controllers: [InvitesController],
  providers: [
    UserMapper,
    InvitationQueueProcessor,
    { provide: InvitesDiToken.SEND_INVITE_USE_CASE, useClass: SendInviteUseCase },
    { provide: InvitesDiToken.ACCEPT_INVITE_USE_CASE, useClass: AcceptInviteUseCase },
    { provide: InvitesDiToken.JOIN_BY_TOKEN_USE_CASE, useClass: JoinByTokenUseCase },
    { provide: InvitesDiToken.GENERATE_INVITE_USE_CASE, useClass: GenerateInviteUseCase },
    { provide: InvitesDiToken.ACCEPT_INVITE_V2_USE_CASE, useClass: AcceptInviteV2UseCase },
    { provide: InvitesDiToken.INVITES_REPOSITORY, useClass: InvitesRepository },
    { provide: InvitesDiToken.SEND_INVITATION_SERVICE, useClass: SendInvitationService },
    { provide: SharedInfrastructureDiToken.TEMPLATE_SERVICE, useClass: TemplateService },
    { provide: SharedInfrastructureDiToken.FILE_SERVICE, useClass: FileService },
    { provide: SharedInfrastructureDiToken.HASH_SERVICE, useClass: HashService },
    { provide: ProbaDITokens.PROBA_REPOSITORY, useClass: ProbaRepository },
    { provide: AuthDiToken.CREATE_USER_PROBA_USE_CASE, useClass: CreateUserProbaUseCase },
  ],
})
export class InvitesModule {}
