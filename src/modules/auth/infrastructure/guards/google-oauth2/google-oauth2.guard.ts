import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"
import { IS_PUBLIC_KEY } from "~modules/common/decorators/public.decorator"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const token = request.signedCookies["__skob_jwt"]

    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const secret = this.configService.getOrThrow("JWT_SECRET")
      const payload = await this.jwtService.verifyAsync(token, { secret })
      request["user"] = payload
    } catch (error) {
      throw new UnauthorizedException()
    }

    return true
  }
}
