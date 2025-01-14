import { Global, Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { BaseToken } from "./constants"
import { SharedInfrastructureDiToken } from "./infrastructure/constants/shared-infrastructure-constants"
import { DatabaseModule } from "./infrastructure/database/database.module"
import { POSTGRES_SCHEMAS } from "./infrastructure/database/postgres/postgres.schemas"
import { FileService } from "./infrastructure/services/file-service/file.service"
import { TemplateService } from "./infrastructure/services/template-service/template.service"
import { HashService } from "./infrastructure/services/generate-hash/hash.service"

@Global()
@Module({
  imports: [DatabaseModule, ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forFeature(POSTGRES_SCHEMAS)],
  providers: [
    {
      provide: BaseToken.APP_CONFIG,
      useClass: ConfigService,
    },
    {
      provide: SharedInfrastructureDiToken.FILE_SERVICE,
      useClass: FileService,
    },
    {
      provide: SharedInfrastructureDiToken.TEMPLATE_SERVICE,
      useClass: TemplateService,
    },
    {
      provide: SharedInfrastructureDiToken.HASH_SERVICE,
      useClass: HashService,
    },
  ],
  exports: [DatabaseModule, BaseToken.APP_CONFIG, TypeOrmModule],
})
export class SharedModule {}
