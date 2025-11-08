import { Sex } from "~modules/users/application/enums/sex.enum"
import { Role } from "~modules/users/application/enums/role.enum"

export class User {
  public readonly id: string
  public readonly name: string
  public readonly email: string
  public readonly sex?: Sex
  public readonly picture?: string
  public readonly is_guide_complete: boolean
  public readonly role?: Role
  public readonly kurin?: {
    id: string
    name: string
  }

  public readonly probas?: {
    id: string
    status: boolean
    completed_at: Date
  }[]

  public readonly subProbas?: {
    id: string
    status: boolean
    completed_at: Date
  }[]

  public readonly camps?: {
    id: string
    name: string
    start_date: Date
    end_date: Date
  }[]

  public readonly scoutDates?: {
    id: string
    title: string
    description: string
    date: Date
  }[]

  public readonly foremanDates?: {
    id: string
    title: string
    description: string
    date: Date
  }[]

  public readonly receivedInvites?: {
    id: string
    status: boolean
    expired_at: Date
  }[]

  public readonly sentInvites?: {
    id: string
    status: boolean
    expired_at: Date
  }[]

  public readonly skills?: {
    id: string
    name: string
  }[]
}
