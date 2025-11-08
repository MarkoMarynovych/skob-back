import { Expose } from "class-transformer"
import { IsBoolean, IsEnum, IsOptional, IsString, IsUrl } from "class-validator"
import { Sex } from "../enums/sex.enum"

export class UpdateUserDto {
  @Expose()
  @IsOptional()
  @IsString()
  name: string

  @Expose()
  @IsOptional()
  @IsEnum(Sex)
  sex: Sex

  @Expose()
  @IsOptional()
  @IsBoolean()
  is_guide_complete: boolean

  @Expose()
  @IsOptional()
  @IsUrl()
  picture?: string
}
