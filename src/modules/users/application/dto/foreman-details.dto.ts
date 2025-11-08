import { Expose, Type } from "class-transformer"

class GroupDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  scoutCount: number

  @Expose()
  averageProgress: number
}

export class ForemanDetailsDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  @Type(() => GroupDto)
  groups: GroupDto[]
}
