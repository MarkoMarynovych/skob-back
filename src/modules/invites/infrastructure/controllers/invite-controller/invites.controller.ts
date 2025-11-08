import { Body, Controller, Get, Inject, Logger, Param, Post, Res, ServiceUnavailableException, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Response } from "express"
import * as process from "node:process"
import { Public } from "~modules/common/decorators/public.decorator"
import { Roles } from "~modules/common/decorators/roles.decorator"
import { RolesGuard } from "~modules/common/guards/roles.guard"
import { User } from "~modules/common/decorators/user.decorator"
import { EmailDto } from "~modules/common/dto/email.dto"
import { JwtPayloadDto } from "~modules/auth/application/dto/jwtpayload.dto"
import { Role } from "~modules/users/application/enums/role.enum"
import { AcceptInviteUseCase } from "../../../application/use-cases/accept-invite/accept-invite.use-case"
import { SendInviteUseCase } from "../../../application/use-cases/send-invite/sent-invite.use-case"
import { JoinByTokenUseCase } from "../../../application/use-cases/join-by-token/join-by-token.use-case"
import { GenerateInviteUseCase } from "../../../application/use-cases/generate-invite/generate-invite.use-case"
import { AcceptInviteV2UseCase } from "../../../application/use-cases/accept-invite/accept-invite-v2.use-case"
import { GenerateInviteDto } from "../../../dto/generate-invite.dto"
import { InvitesDiToken } from "../../constants/invites-constants"

@ApiTags("Invites")
@Controller("invites")
export class InvitesController {
  constructor(
    @Inject(InvitesDiToken.ACCEPT_INVITE_USE_CASE)
    private readonly acceptInviteUseCase: AcceptInviteUseCase,
    @Inject(InvitesDiToken.SEND_INVITE_USE_CASE)
    private readonly sendInviteUseCase: SendInviteUseCase,
    @Inject(InvitesDiToken.JOIN_BY_TOKEN_USE_CASE)
    private readonly joinByTokenUseCase: JoinByTokenUseCase,
    @Inject(InvitesDiToken.GENERATE_INVITE_USE_CASE)
    private readonly generateInviteUseCase: GenerateInviteUseCase,
    @Inject(InvitesDiToken.ACCEPT_INVITE_V2_USE_CASE)
    private readonly acceptInviteV2UseCase: AcceptInviteV2UseCase
  ) {
    this.FRONTEND_URL = process.env.FRONTEND_BASE_URL ?? ""
    if (!this.FRONTEND_URL) {
      throw new ServiceUnavailableException("FRONTEND_BASE_URL is missing")
    }
  }

  private readonly FRONTEND_URL: string
  private readonly logger = new Logger(InvitesController.name)

  @UsePipes(new ValidationPipe())
  @UseGuards(RolesGuard)
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

  @Post("join/:inviteToken")
  async joinByToken(@Param("inviteToken") inviteToken: string, @User() { sub: userId }: JwtPayloadDto) {
    this.logger.log("POST: /invites/join/:inviteToken")
    return await this.joinByTokenUseCase.execute({
      inviteToken,
      userId,
    })
  }

  @Post("generate")
  @UsePipes(new ValidationPipe())
  async generateInvite(@Body() dto: GenerateInviteDto, @User() { sub: userId }: JwtPayloadDto) {
    this.logger.log("POST: /invites/generate")
    return await this.generateInviteUseCase.execute({
      userId,
      type: dto.type,
      contextId: dto.contextId,
    })
  }

  @Post("accept/:token")
  async acceptInviteV2(@Param("token") token: string, @User() { sub: userId }: JwtPayloadDto) {
    this.logger.log("POST: /invites/accept/:token")
    return await this.acceptInviteV2UseCase.execute({
      token,
      userId,
    })
  }
}
