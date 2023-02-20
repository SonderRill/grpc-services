import { IsString } from 'class-validator'

export class ValidateRequestDto {
  @IsString()
  readonly token: string
}
