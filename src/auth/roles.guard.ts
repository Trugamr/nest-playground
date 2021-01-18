import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { Role, User } from 'src/users/user.schema'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler())
    // If RolesGuard is being used but not Roles decorator is used to speficy
    // rules for the route then allow the request to be fulfilled
    if (!roles) {
      return true
    }
    const request: Request = context.switchToHttp().getRequest()
    const user = request.user as User

    const allowed = this.matchRoles(roles, user.roles)

    // Throwing exception manually to use custom message instead of default one
    if (!allowed) {
      throw new ForbiddenException(
        `Only users with "${roles.join(
          ', ',
        )}" role(s) are allowed to access the resource`,
      )
    }

    return allowed
  }

  /**
   * This method will return true if any one of the specified roles exists in user roles
   * @param allowedRoles Allowed roles, specified using Roles decorator
   * @param userRoles User's roles to check the specified roles against
   */
  matchRoles(allowedRoles: Role[], userRoles: Role[]): boolean {
    return allowedRoles.some(role => userRoles.includes(role))
  }
}
