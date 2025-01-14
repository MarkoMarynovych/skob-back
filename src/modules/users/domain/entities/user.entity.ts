import { Sex } from "~modules/users/application/enums/sex.enum"

export class User {
  public readonly id: string
  public readonly name: string
  public readonly email: string
  public readonly sex?: Sex
  public readonly picture?: string
  public readonly is_guide_complete: boolean

  public readonly foremans?: User[]
  public readonly scouts?: User[]

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
