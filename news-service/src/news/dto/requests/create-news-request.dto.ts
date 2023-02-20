import { IsString, MaxLength } from 'class-validator'

export class CreateNewsRequestDto {
  @MaxLength(55000)
  @IsString()
  article: string
}
