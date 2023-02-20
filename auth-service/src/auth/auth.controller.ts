import { RolesGuard } from './guards/roles.guard'
import { AuthGuard } from './guards/auth.guard'
import { Roles } from './guards/roles.decorator'
import { Controller, Inject, Get, Post, Body, UseGuards } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { AuthService } from './service/auth.service'
import { AUTH_SERVICE_NAME } from './constants'
import { UserEntity } from './entities/user.entity'
import { LoginResponse } from './dto/responses/login-response.dto'
import { ValidateResponse } from './dto/responses/validate-response'
import { RegisterRequestDto } from './dto/requests/register-request'
import { LoginRequestDto } from './dto/requests/login-request.dto'
import { ValidateRequestDto } from './dto/requests/validate-request'
import { Role } from './enums/role.enum'

@Controller()
export class AuthController {
  @Inject(AuthService)
  private readonly _authService: AuthService

  @Post('register')
  register(@Body() payload: RegisterRequestDto): Promise<UserEntity> {
    return this._authService.register(payload)
  }

  @Post('login')
  login(@Body() payload: LoginRequestDto): Promise<LoginResponse> {
    return this._authService.login(payload)
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Validate')
  validate(payload: ValidateRequestDto): Promise<ValidateResponse> {
    return this._authService.validate(payload)
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  findUsers() {
    return this._authService.findUsers()
  }
}
