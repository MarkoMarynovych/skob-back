import { Inject, Injectable } from "@nestjs/common"
import * as handlebars from "handlebars"
import { FileService } from "../file-service/file.service"
import { SharedInfrastructureDiToken } from "~shared/infrastructure/constants/shared-infrastructure-constants"

@Injectable()
export class TemplateService {
  constructor(@Inject(SharedInfrastructureDiToken.FILE_SERVICE) private readonly fileService: FileService) {}

  public compileTemplate<T extends Record<string, any>>(templatePath: string, data: T): string {
    const templateSource = this.fileService.readFile(templatePath)
    const template = handlebars.compile(templateSource)
    return template(data)
  }
}
