import { ClientGrpc } from '@nestjs/microservices'
import { Injectable, Inject, OnModuleInit, HttpException } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { ValidateResponse } from './interfaces/validate-response'

@Injectable()
export class RemoteAuthService implements OnModuleInit {
  private _authService: ClientGrpc

  constructor(@Inject('AUTH_SERVICE') private client: ClientGrpc) {}

  async onModuleInit() {
    this._authService = await this.client.getService('AuthService')
  }

  async validate(token: string): Promise<ValidateResponse> {

    const response = await firstValueFrom<ValidateResponse>(
      //@ts-ignore
      this._authService.validate({
        token,
      }),
    )

    if (response.error) {
      throw new HttpException(response.error.map((err) => err).join(' '), response.status)
    }

    return response
  }
}
