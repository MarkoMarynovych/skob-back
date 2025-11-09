// src/data-source.ts
import "dotenv/config"
import "tsconfig-paths/register"
import { DataSource, DataSourceOptions } from "typeorm"
import { POSTGRES_SCHEMAS } from "./shared/infrastructure/database/postgres/postgres.schemas"

const databaseUrl = process.env.DATABASE_URL

let dataSourceOptions: DataSourceOptions

if (databaseUrl) {
  // Use DATABASE_URL if provided (preferred for production)
  dataSourceOptions = {
    type: "postgres",
    url: databaseUrl,
    entities: POSTGRES_SCHEMAS,
    migrations: [__dirname + "/database/migrations/*{.ts,.js}"],
    synchronize: false, // IMPORTANT: Always false for a migration-based approach
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  }
} else {
  // Fallback to individual fields (for local development)
  dataSourceOptions = {
    type: "postgres",
    host: process.env.POSTGRES_DB_HOST,
    port: Number(process.env.POSTGRES_DB_PORT ?? 5432),
    username: process.env.POSTGRES_DB_USERNAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    database: process.env.POSTGRES_DB_DATABASE,
    entities: POSTGRES_SCHEMAS,
    migrations: [__dirname + "/database/migrations/*{.ts,.js}"],
    synchronize: false, // IMPORTANT: Always false for a migration-based approach
  }
}

export const AppDataSourceOptions = dataSourceOptions
export const AppDataSource = new DataSource(AppDataSourceOptions)
