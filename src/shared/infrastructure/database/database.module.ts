import { RedisModule } from "@nestjs-modules/ioredis"
import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { DataSource, DataSourceOptions } from "typeorm"
import { POSTGRES_SCHEMAS } from "./postgres/postgres.schemas"
import { seedProbas } from "./postgres/seeds/proba.seed"

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
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
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options as DataSourceOptions).initialize()
        await seedProbas(dataSource)
        return dataSource
      },
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "single",
        url: `redis://${configService.getOrThrow("REDIS_HOST")}:${configService.getOrThrow("REDIS_PORT")}`,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule, RedisModule],
})
export class DatabaseModule {}
