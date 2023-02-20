import { Role } from './../enums/role.enum'

export interface ValidateResponse {
  userId: number
  role: Role
  status?: number
  error?: string[]
}
