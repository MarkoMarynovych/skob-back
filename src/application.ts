import { NestFactory } from "@nestjs/core"
import { NestExpressApplication } from "@nestjs/platform-express"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as cookieParser from "cookie-parser"
import * as process from "node:process"
import { AppModule } from "./app.module"

export class Application {
  private readonly port: string | number
  protected app: NestExpressApplication

  constructor(port: string | number = 3000) {
    this.port = port
  }

  public async init() {
    this.app = await NestFactory.create<NestExpressApplication>(AppModule, {
      bodyParser: true,
    })

    this.setupMiddleware()
    this.setupSwagger()
    await this.app.listen(this.port)
  }

  private setupMiddleware() {
    const allowedOrigins = process.env.FRONTEND_BASE_URL ? [process.env.FRONTEND_BASE_URL, "http://localhost:5173"] : ["http://localhost:5173"]

    this.app.enableCors({
      origin: allowedOrigins,
      credentials: true,
    })
    this.app.use(cookieParser(process.env.COOKIES_SECRET))
    this.app.setGlobalPrefix("api")
  }

  private setupSwagger() {
    const config = new DocumentBuilder().setTitle("Proba api").setDescription("The proba API description").setVersion("1.0").build()

    const documentFactory = () => SwaggerModule.createDocument(this.app, config)
    SwaggerModule.setup("api", this.app, documentFactory)
  }
}
