import { Controller, Get, Inject, Req, Res, UseGuards } from "@nestjs/common"
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport"
import { ApiTags } from "@nestjs/swagger"
import { Response } from "express"
import { Public } from "~modules/common/decorators/public.decorator"
import { AuthenticateUserUseCase } from "~modules/auth/application/use-cases/google-authenticate.use-case"
import { AuthDiToken } from "~modules/auth/constants"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  private readonly FRONTEND_URL: string

  constructor(
    @Inject(AuthDiToken.AUTHENTICATE_USER_USE_CASE)
    private readonly authenticateUserUseCase: AuthenticateUserUseCase
  ) {
    this.FRONTEND_URL = process.env.FRONTEND_BASE_URL || "http://localhost:5173"
  }

  @Public()
  @Get("google")
  @UseGuards(PassportAuthGuard("google"))
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Public()
  @Get("google/callback")
  @UseGuards(PassportAuthGuard("google"))
  async googleAuthRedirect(@Req() req: any, @Res({ passthrough: true }) response: Response) {
    const { token } = await this.authenticateUserUseCase.execute({ user: req.user })

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000
    const expires = new Date(Date.now() + oneDayInMilliseconds)

    response.cookie("__skob_jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      expires: expires,
      signed: true,
    })

    response.redirect(this.FRONTEND_URL)
  }

  @Public()
  @Get("logout")
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("__skob_jwt")
    return { message: "Logged out successfully" }
  }
}
