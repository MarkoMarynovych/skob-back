import { IsEnum, IsUUID, IsNotEmpty } from "class-validator"
import { InviteType } from "../domain/enums/invite-type.enum"

export class GenerateInviteDto {
  @IsEnum(InviteType)
  @IsNotEmpty()
  type: InviteType

  @IsUUID()
  @IsNotEmpty()
  contextId: string
}
