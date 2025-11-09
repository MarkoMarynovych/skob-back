import { Injectable, Logger } from "@nestjs/common"
import { ISendInvitationService } from "~modules/invites/application/services/send-invitation.service"

interface ISendInvitationPayload {
  scoutEmail: string
  inviteHash: string
  scoutName: string
  foremanName: string
}

@Injectable()
export class SendInvitationService implements ISendInvitationService {
  private readonly logger = new Logger(SendInvitationService.name)

  public async sendInvitation(payload: ISendInvitationPayload): Promise<void> {
    const invitationLink = `${process.env.BACKEND_URL}/api/invites/${payload.inviteHash}`

    this.logger.log(`Invitation created for: ${payload.scoutEmail}`)
    this.logger.log(`Invitation link: ${invitationLink}`)
    this.logger.log(`Scout: ${payload.scoutName}, Foreman: ${payload.foremanName}`)
  }
}
