import { Body, Controller, Get, Inject, Logger, Param, Res, ServiceUnavailableException, UsePipes, ValidationPipe } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Response } from "express"
import * as process from "node:process"
import { Public } from "~modules/common/decorators/public.decorator"
import { Roles } from "~modules/common/decorators/roles.decorator"
import { EmailDto } from "~modules/common/dto/email.dto"
import { Role } from "~shared/domain/enums/role.enum"
import { AcceptInviteUseCase } from "../../../application/use-cases/accept-invite/accept-invite.use-case"
import { SendInviteUseCase } from "../../../application/use-cases/send-invite/sent-invite.use-case"
import { InvitesDiToken } from "../../constants/invites-constants"

@ApiTags("Invites")
@Controller("invites")
export class InvitesController {
  constructor(
    @Inject(InvitesDiToken.ACCEPT_INVITE_USE_CASE)
    private readonly acceptInviteUseCase: AcceptInviteUseCase,
    @Inject(InvitesDiToken.SEND_INVITE_USE_CASE)
    private readonly sendInviteUseCase: SendInviteUseCase
  ) {
    this.FRONTEND_URL = process.env.FRONTEND_BASE_URL ?? ""
    if (!this.FRONTEND_URL) {
      throw new ServiceUnavailableException("FRONTEND_BASE_URL is missing")
    }
  }

  private readonly FRONTEND_URL: string
  private readonly logger = new Logger(InvitesController.name)

  @UsePipes(new ValidationPipe())
  @Roles(Role.FOREMAN)
  @Get("send/:email")
  async sendInvite(@Param() params: EmailDto, @Body("foremanEmail") foremanEmail: string) {
    this.logger.log("GET: /invites/send/:email")
    await this.sendInviteUseCase.execute({ email: params.email, foremanEmail })
  }

  @Get(":hash")
  @Public()
  async acceptInvite(@Param("hash") hash: string, @Res({ passthrough: true }) res: Response) {
    this.logger.log("GET: /invites/:hash")
    await this.acceptInviteUseCase.execute({ hash: hash })
    res.redirect(this.FRONTEND_URL)
  }
}
