import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { POSTGRES_SCHEMAS } from "./postgres/postgres.schemas"

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get("DATABASE_URL")

        if (databaseUrl) {
          return {
            type: "postgres",
            url: databaseUrl,
            synchronize: false,
            entities: POSTGRES_SCHEMAS,
            ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
          }
        } else {
          return {
            type: "postgres",
            host: configService.getOrThrow("POSTGRES_DB_HOST"),
            port: Number(configService.getOrThrow("POSTGRES_DB_PORT") ?? 5432),
            username: configService.getOrThrow("POSTGRES_DB_USERNAME"),
            password: configService.getOrThrow("POSTGRES_DB_PASSWORD"),
            database: configService.getOrThrow("POSTGRES_DB_DATABASE"),
            synchronize: false,
            entities: POSTGRES_SCHEMAS,
          }
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
