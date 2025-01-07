import { Global, Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { BaseToken } from "./constants"
import { DatabaseModule } from "./infrastructure/database/database.module"
import { POSTGRES_SCHEMAS } from "./infrastructure/database/postgres/postgres.schemas"

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(POSTGRES_SCHEMAS), DatabaseModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [{ provide: BaseToken.APP_CONFIG, useClass: ConfigService }],
  exports: [TypeOrmModule.forFeature(POSTGRES_SCHEMAS), BaseToken.APP_CONFIG],
})
export class SharedModule {}
