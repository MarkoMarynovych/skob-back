import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { IS_PUBLIC_KEY } from "~modules/common/decorators/public.decorator"
import { Role } from "~modules/users/application/enums/role.enum"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is public - if so, skip role checking
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
    if (isPublic) {
      return true
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>("roles", [context.getHandler(), context.getClass()])
    if (!requiredRoles) {
      return true // No roles required, access granted
    }
    const { user } = context.switchToHttp().getRequest()

    // AuthGuard runs before this, so user is guaranteed to exist or request would have been rejected
    // User object from JWT payload will have a 'role' property
    return requiredRoles.some((role) => user?.role === role)
  }
}
