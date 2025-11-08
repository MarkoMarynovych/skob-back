import { InjectQueue } from "@nestjs/bullmq"
import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common"
import * as SendGrid from "@sendgrid/mail"
import { Queue } from "bullmq"
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
  private readonly senderEmail: string
  private readonly logger = new Logger(SendInvitationService.name)

  constructor(
    @Inject(SharedInfrastructureDiToken.TEMPLATE_SERVICE) private readonly templateService: TemplateService,
    @InjectQueue("invitations") private invitationsQueue: Queue
  ) {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY ?? "")
    this.senderEmail = process.env.SENDGRID_VERIFIED_SENDER_EMAIL ?? ""
  }

  public async sendInvitation(payload: ISendInvitationPayload): Promise<void> {
    try {
      const htmlToSend = this.templateService.compileTemplate("./templates/inviteTemplate.html", {
        scoutName: payload.scoutName,
        foremanName: payload.foremanName,
        invitationLink: `${process.env.BACKEND_URL}/api/invites/${payload.inviteHash}`,
      })

      const emailData = {
        to: payload.scoutEmail,
        from: this.senderEmail,
        subject: `Вас запрошено у групу ${payload.foremanName}`,
        html: htmlToSend,
      }

      await this.invitationsQueue.add("send-invitation-email", emailData, {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      })

      this.logger.log("Invite job added to queue successfully")
    } catch (error) {
      this.logger.error("Failed to queue invite:", error)
      throw new InternalServerErrorException("Failed to queue invite")
    }
  }
}
