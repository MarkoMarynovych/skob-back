import { Expose, Type } from "class-transformer"

class ScoutDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  completedItems: number

  @Expose()
  totalItems: number
}

export class GroupDetailsDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  @Type(() => ScoutDto)
  scouts: ScoutDto[]
}
