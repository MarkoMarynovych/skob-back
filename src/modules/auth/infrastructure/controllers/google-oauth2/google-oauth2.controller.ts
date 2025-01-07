import { Controller, Get, Inject, Req, Res, ServiceUnavailableException, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ApiTags } from "@nestjs/swagger"
import { Response } from "express"
import * as process from "node:process"
import { AuthenticateUserUseCase } from "~modules/auth/application/use-cases/google-authenticate.use-case"
import { AuthDiToken } from "~modules/auth/constants"
import { Public } from "~modules/common/decorators/public.decorator"

@Public()
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthDiToken.AUTHENTICATE_USER_USE_CASE) private readonly authenticateUserUseCase: AuthenticateUserUseCase) {
    this.FRONTEND_URL = process.env.FRONTEND_BASE_URL ?? ""
    if (!this.FRONTEND_URL) {
      throw new ServiceUnavailableException("FRONTEND_BASE_URL is missing")
    }
  }

  private readonly FRONTEND_URL: string

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req: any) {
    console.log("req", req)
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req: any, @Res({ passthrough: true }) response: Response) {
    const { token } = await this.authenticateUserUseCase.execute({ user: req.user })
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000
    const expires = new Date(Date.now() + oneDayInMilliseconds)

    response.cookie("__skob_jwt", token, { path: "/", sameSite: "none", secure: true, httpOnly: true, expires: expires, maxAge: oneDayInMilliseconds })
    console.log("token", token)
    response.redirect(this.FRONTEND_URL)
  }

  @Get("logout")
  async logout(@Res({ passthrough: true }) response: Response) {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000
    const pastDate = new Date(Date.now() - oneDayInMilliseconds)
    response.cookie("__skob_jwt", "", { path: "/", sameSite: "none", secure: true, httpOnly: true, expires: pastDate, maxAge: 0 })
  }
}
