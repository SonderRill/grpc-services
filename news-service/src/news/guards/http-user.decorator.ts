import { User } from './../interfaces/user'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const HttpUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request & { user: User }>()
  return request.user
})
