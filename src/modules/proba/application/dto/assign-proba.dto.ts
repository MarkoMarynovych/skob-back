import { IsUUID } from "class-validator"

export class AssignProbaDto {
  @IsUUID()
  probaTemplateId: string
}
