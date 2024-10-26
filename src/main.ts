import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { NestExpressApplication } from "@nestjs/platform-express"
import * as cookieParser from "cookie-parser"
import * as process from "node:process"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors({
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
  })
  app.use(cookieParser(process.env.COOKIE_SECRET))
  app.setGlobalPrefix("api")

  const config = new DocumentBuilder().setTitle("Proba api").setDescription("The proba API description").setVersion("1.0").build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, documentFactory)
  await app.listen(3000)
}
bootstrap()
