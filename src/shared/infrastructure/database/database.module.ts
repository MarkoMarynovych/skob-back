import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { POSTGRES_SCHEMAS } from "./postgres/postgres.schemas"
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.getOrThrow("POSTGRES_DB_HOST"),
        port: Number(configService.getOrThrow("POSTGRES_DB_PORT") ?? 5432),
        username: configService.getOrThrow("POSTGRES_DB_USERNAME"),
        password: configService.getOrThrow("POSTGRES_DB_PASSWORD"),
        database: configService.getOrThrow("POSTGRES_DB_DATABASE"),
        synchronize: configService.getOrThrow("POSTGRES_DB_SYNCRONIZE") ?? false,
        entities: POSTGRES_SCHEMAS,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  constructor(private dataSource: DataSource) {}
}
