import { Inject, Injectable, Logger } from "@nestjs/common"
import { ISendInvitationService } from "~modules/invites/application/services/send-invitation.service"
import { SharedInfrastructureDiToken } from "~shared/infrastructure/constants/shared-infrastructure-constants"
import { TemplateService } from "~shared/infrastructure/services/template-service/template.service"

interface ISendInvitationPayload {
  scoutEmail: string
  inviteHash: string
  scoutName: string
  foremanName: string
}

@Injectable()
export class SendInvitationService implements ISendInvitationService {
  private readonly logger = new Logger(SendInvitationService.name)

  constructor(
    @Inject(SharedInfrastructureDiToken.TEMPLATE_SERVICE) private readonly templateService: TemplateService
  ) {}

  public async sendInvitation(payload: ISendInvitationPayload): Promise<void> {
    const invitationLink = `${process.env.BACKEND_URL}/api/invites/${payload.inviteHash}`

    this.logger.log(`[EMAIL SIMULATION] Sending invitation to ${payload.scoutEmail}`)
    this.logger.log(`[EMAIL SIMULATION] Scout: ${payload.scoutName}`)
    this.logger.log(`[EMAIL SIMULATION] Foreman: ${payload.foremanName}`)
    this.logger.log(`[EMAIL SIMULATION] Invitation link: ${invitationLink}`)
    this.logger.log(`[EMAIL SIMULATION] Email sent successfully`)
  }
}
