import { RemoteAuthService } from './../remote-auth.service'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { User } from '../interfaces/user'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly remoteAuthService: RemoteAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: User }>()
    const prefix = 'Bearer '

    const authHeader = request.headers['authorization'] as string
    if (!authHeader || !authHeader.includes(prefix)) {
      return false
    }

    const token = authHeader.slice(authHeader.indexOf(' ') + 1)

    const { status, ...user } = await this.remoteAuthService.validate(token)
    request.user = user
    return true
  }
}
