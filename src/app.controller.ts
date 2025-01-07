import { Controller, Get } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"

import { AppService } from "./app.service"
import { Public } from "~modules/common/decorators/public.decorator"

@ApiTags("Ping")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  ping(): string {
    return this.appService.ping()
  }
}
