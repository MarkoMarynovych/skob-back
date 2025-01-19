import { BullModule } from "@nestjs/bull"
import { Module } from "@nestjs/common"
import { ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"
import { ProbaRepository } from "~modules/proba/infrastructure/repositories/proba.repository"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { UserRepository } from "~modules/users/infrastructure/repositories/user.repository"
import { SharedInfrastructureDiToken } from "~shared/infrastructure/constants/shared-infrastructure-constants"
import { FileService } from "~shared/infrastructure/services/file-service/file.service"
import { HashService } from "~shared/infrastructure/services/generate-hash/hash.service"
import { TemplateService } from "~shared/infrastructure/services/template-service/template.service"
import { AcceptInviteUseCase } from "./application/use-cases/accept-invite/accept-invite.use-case"
import { SendInviteUseCase } from "./application/use-cases/send-invite/sent-invite.use-case"
import { UserMapper } from "./domain/mappers/user.mapper"
import { InvitesDiToken } from "./infrastructure/constants/invites-constants"
import { InvitesController } from "./infrastructure/controllers/invite-controller/invites.controller"
import { InvitationQueueProcessor } from "./infrastructure/processors/invitation-queue.processor"
import { InvitesRepository } from "./infrastructure/repositories/invites.repository"
import { SendInvitationService } from "./infrastructure/services/send-invitation.service"
import { AuthDiToken } from "~modules/auth/constants"
import { CreateUserProbaUseCase } from "~modules/proba/application/use-cases/create-user-proba/create-user-proba.use-case"

@Module({
  imports: [BullModule.registerQueue({ name: "invitations" })],
  controllers: [InvitesController],
  providers: [
    UserMapper,
    { provide: InvitesDiToken.SEND_INVITE_USE_CASE, useClass: SendInviteUseCase },
    { provide: InvitesDiToken.ACCEPT_INVITE_USE_CASE, useClass: AcceptInviteUseCase },
    { provide: UserDiToken.USER_REPOSITORY, useClass: UserRepository },
    { provide: InvitesDiToken.INVITES_REPOSITORY, useClass: InvitesRepository },
    { provide: InvitesDiToken.SEND_INVITATION_SERVICE, useClass: SendInvitationService },
    { provide: SharedInfrastructureDiToken.TEMPLATE_SERVICE, useClass: TemplateService },
    { provide: SharedInfrastructureDiToken.FILE_SERVICE, useClass: FileService },
    { provide: SharedInfrastructureDiToken.HASH_SERVICE, useClass: HashService },
    { provide: ProbaDITokens.PROBA_REPOSITORY, useClass: ProbaRepository },
    { provide: ProbaDITokens.PROBA_REPOSITORY, useClass: ProbaRepository },
    { provide: AuthDiToken.CREATE_USER_PROBA_USE_CASE, useClass: CreateUserProbaUseCase },
    InvitationQueueProcessor,
  ],
})
export class InvitesModule {}
