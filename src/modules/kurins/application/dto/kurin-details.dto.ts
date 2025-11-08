import { Expose, Type } from "class-transformer"

class LiaisionDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  email: string
}

class ForemanDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  groupCount: number

  @Expose()
  scoutCount: number

  @Expose()
  averageProgress: number
}

export class KurinDetailsDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  @Type(() => LiaisionDto)
  liaison?: LiaisionDto

  @Expose()
  @Type(() => ForemanDto)
  foremen: ForemanDto[]
}
