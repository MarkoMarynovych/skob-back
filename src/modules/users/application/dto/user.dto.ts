import { Expose, Type } from "class-transformer"
import { Sex } from "../enums/sex.enum"

class ScoutForemanDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  email: string
}

class ProbaDto {
  @Expose()
  id: string

  @Expose()
  status: boolean

  @Expose()
  completed_at: Date
}

class SubProbaDto {
  @Expose()
  id: string

  @Expose()
  status: boolean

  @Expose()
  completed_at: Date
}

class CampDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  start_date: Date

  @Expose()
  end_date: Date
}

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

  @Expose()
  @Type(() => ScoutForemanDto)
  foremans?: ScoutForemanDto[]

  @Expose()
  @Type(() => ScoutForemanDto)
  scouts?: ScoutForemanDto[]

  @Expose()
  @Type(() => ProbaDto)
  probas?: ProbaDto[]

  @Expose()
  @Type(() => SubProbaDto)
  subProbas?: SubProbaDto[]

  @Expose()
  @Type(() => CampDto)
  camps?: CampDto[]
}
