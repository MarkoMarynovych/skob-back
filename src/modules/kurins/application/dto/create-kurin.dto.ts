import { IsString, IsNotEmpty, IsOptional, IsUUID } from "class-validator"

export class CreateKurinDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsUUID()
  liaisonId?: string
}
