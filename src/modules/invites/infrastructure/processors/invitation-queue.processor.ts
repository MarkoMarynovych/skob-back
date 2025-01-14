import { Process, Processor } from "@nestjs/bull"
import { Logger } from "@nestjs/common"
import * as SendGrid from "@sendgrid/mail"
import { Job } from "bull"

@Processor("invitations")
export class InvitationQueueProcessor {
  private readonly logger = new Logger(InvitationQueueProcessor.name)

  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY ?? "")
  }

  @Process("send-invitation-email")
  async process(job: Job) {
    try {
      await SendGrid.send(job.data)
      this.logger.log(`Processed invitation email for: ${job.data.to}`)
    } catch (error) {
      this.logger.error("Failed to process invitation email:", error)
      throw error
    }
  }
}
