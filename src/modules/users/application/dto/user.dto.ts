import { Expose } from "class-transformer"
import { Sex } from "../enums/sex.enum"
export class UserDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  sex?: Sex

  @Expose()
  is_guide_complete: boolean

  @Expose()
  picture?: string

  @Expose()
  token?: string
}
