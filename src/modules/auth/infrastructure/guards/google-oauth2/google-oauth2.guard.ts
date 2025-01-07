import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"
import { IS_PUBLIC_KEY } from "~modules/common/decorators/public.decorator"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  private readonly logger = new Logger(AuthGuard.name)

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])

    if (isPublic) {
      return true
    }

    const req = context.switchToHttp().getRequest()
    const jwt_token = this.extractTokenFromCookies(req)
    this.extractTokenFromCookies(req)

    if (!jwt_token) {
      this.logger.log(`token missing`)
      throw new UnauthorizedException()
    }

    try {
      req["user"] = await this.jwtService.verifyAsync(jwt_token, { secret: "secret" })
    } catch {
      this.logger.log(`${jwt_token} not verified`)
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    return request.cookies.__skob_jwt ?? undefined
  }
}
