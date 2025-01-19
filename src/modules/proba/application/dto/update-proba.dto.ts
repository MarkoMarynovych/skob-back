import { IsBoolean, IsUUID } from "class-validator"

export class UpdateProbaDto {
  @IsUUID()
  userId: string

  @IsUUID()
  itemId: string

  @IsUUID()
  foremanId: string

  @IsBoolean()
  status: boolean
}
