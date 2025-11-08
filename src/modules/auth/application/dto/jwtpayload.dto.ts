import { IsEnum, IsInt, IsString } from "class-validator"
import { Role } from "~modules/users/application/enums/role.enum"

export class JwtPayloadDto {
  @IsString()
  sub: string

  @IsString()
  email: string

  @IsEnum(Role)
  role: Role

  @IsInt()
  iat: number

  @IsInt()
  exp: number
}
