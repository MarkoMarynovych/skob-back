// src/data-source.ts
import "dotenv/config"
import "tsconfig-paths/register"
import { DataSource, DataSourceOptions } from "typeorm"
import { POSTGRES_SCHEMAS } from "./shared/infrastructure/database/postgres/postgres.schemas"

export const AppDataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.POSTGRES_DB_HOST,
  port: Number(process.env.POSTGRES_DB_PORT),
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_DATABASE,
  entities: POSTGRES_SCHEMAS,
  migrations: [__dirname + "/database/migrations/*{.ts,.js}"],
  synchronize: false, // IMPORTANT: Always false for a migration-based approach
}

export const AppDataSource = new DataSource(AppDataSourceOptions)
