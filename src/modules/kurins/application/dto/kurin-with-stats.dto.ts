import { Expose, Type } from "class-transformer"

class LiaisionDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  email: string
}

export class KurinWithStatsDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  @Type(() => LiaisionDto)
  liaison?: LiaisionDto

  @Expose()
  foremanCount: number

  @Expose()
  groupCount: number

  @Expose()
  scoutCount: number
}
