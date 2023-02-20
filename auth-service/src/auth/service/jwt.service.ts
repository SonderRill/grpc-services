import { Injectable, Inject } from '@nestjs/common'
import { JwtService as Jwt } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class JwtService {
  @Inject(Jwt)
  private readonly _jwtService: Jwt

  async decode(token: string): Promise<unknown> {
    return this._jwtService.decode(token)
  }

  generateToken(userId: number): string {
    return this._jwtService.sign({ sub: userId })
  }

  isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword)
  }

  encodePassword(password: string): string {
    const salt = bcrypt.genSaltSync(10)

    return bcrypt.hashSync(password, salt)
  }

  async verify(token: string): Promise<any> {
    try {
      return this._jwtService.verify(token)
    } catch (err) {}
  }
}
