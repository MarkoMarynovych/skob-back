import { Sex } from "~modules/users/application/enums/sex.enum"

export class User {
  public readonly id: string
  public readonly name: string
  public readonly email: string
  public readonly sex?: Sex
  public readonly picture?: string
  public readonly is_guide_complete: boolean
  public readonly foreman?: string
  public readonly scouts?: string
}
