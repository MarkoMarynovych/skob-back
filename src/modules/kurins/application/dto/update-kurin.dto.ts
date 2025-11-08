import { IsString, IsOptional, IsUUID } from "class-validator"

export class UpdateKurinDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsUUID()
  liaisonId?: string
}
