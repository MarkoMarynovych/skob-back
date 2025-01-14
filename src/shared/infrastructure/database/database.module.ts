import { RedisModule } from "@nestjs-modules/ioredis"
import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
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
