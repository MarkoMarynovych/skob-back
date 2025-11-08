import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from "class-validator"

export class SignEntireProbaDto {
  @IsUUID()
  userId: string

  @IsUUID()
  foremanId: string

  @IsBoolean()
  status: boolean

  @IsString()
  probaName: string

  @IsOptional()
  @IsDateString()
  completedAt?: Date
}
