import { HttpStatus, Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from './jwt.service'
import { UserEntity } from '../entities/user.entity'
import { Role } from '../enums/role.enum'
import { LoginResponse } from '../dto/responses/login-response.dto'
import { ValidateResponse } from '../dto/responses/validate-response'
import { RegisterRequestDto } from '../dto/requests/register-request'
import { LoginRequestDto } from '../dto/requests/login-request.dto'
import { ValidateRequestDto } from '../dto/requests/validate-request'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    private readonly _jwtService: JwtService,
  ) {}

  async register({ email, password }: RegisterRequestDto): Promise<UserEntity> {
    let user = await this._userRepository.findOne({ where: { email } })

    if (user) {
      throw new ConflictException('E-Mail already exists')
    }

    user = this._userRepository.create({
      email,
      password: this._jwtService.encodePassword(password),
      role: Role.USER,
    })

    return this._userRepository.save(user)
  }

  async login({ email, password }: LoginRequestDto): Promise<LoginResponse> {
    const user = await this._userRepository.findOne({ where: { email } })

    if (!user) {
      throw new UnauthorizedException('Invalid login details')
    }

    const isPasswordValid = this._jwtService.isPasswordValid(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid login details')
    }

    const token = this._jwtService.generateToken(user.id)

    return { token }
  }

  findUsers(): Promise<UserEntity[]> {
    return this._userRepository.find()
  }

  async validate({ token }: ValidateRequestDto): Promise<ValidateResponse> {

    const decoded = await this._jwtService.verify(token)
    if (!decoded) {
      return { status: HttpStatus.FORBIDDEN, error: ['Token is invalid'], userId: null, role: null }
    }

    const user = await this._userRepository.findOneBy({ id: decoded.sub })

    if (!user) {
      return { status: HttpStatus.NOT_FOUND, error: ['User not found'], userId: null, role: null }
    }

    return { status: HttpStatus.OK, error: null, userId: decoded.sub, role: user.role }
  }
}
