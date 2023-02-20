import { Role } from './../../enums/role.enum'
interface Response {
  status: number
  error: string[]
}

export interface ValidateResponse extends Response {
  userId: number
  role: Role
}
