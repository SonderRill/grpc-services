import { UserEntity } from './../entities/user.entity'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from '../service/auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly _authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<
      Request & {
        user: Pick<UserEntity, 'role'> & { userId: number }
      }
    >()
    const prefix = 'Bearer '

    const authHeader = request.headers['authorization'] as string
    if (!authHeader || !authHeader.includes(prefix)) {
      return false
    }

    const token = authHeader.slice(authHeader.indexOf(' ') + 1)

    const { status, ...user } = await this._authService.validate({ token })
    request.user = user
    return true
  }
}
