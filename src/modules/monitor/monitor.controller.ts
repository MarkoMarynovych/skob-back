import { Controller, Get, Logger } from "@nestjs/common"
import { Public } from "../common/decorators/public.decorator"
import { ApiTags } from "@nestjs/swagger"

@Public()
@ApiTags("Monitor")
@Controller("monitor")
export class MonitorController {
  private readonly logger = new Logger(MonitorController.name)

  @Get()
  async getStats() {
    this.logger.log("/GET getStats")
    return { message: "backend is up" }
  }
}
