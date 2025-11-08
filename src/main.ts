import { Logger } from "@nestjs/common"
import { Application } from "./application"

const port = process.env.PORT || 3000
const application = new Application(port)
const logger = new Logger("Bootstrap")

application.init().catch((err) => {
  logger.error("Application failed to start:", err)
})
