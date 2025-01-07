import { Expose } from "class-transformer"
export class CreateUserDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  is_guide_complete: boolean

  @Expose()
  picture?: string
}
