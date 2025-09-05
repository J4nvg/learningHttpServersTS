import 'dotenv/config';
import type { MigrationConfig } from "drizzle-orm/migrator";



export function envOrThrow(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable "${key}" is not defined.`);
  }
  return value;
}


export type APIConfig = {
  fileserverHits: number;
  db: db;
};



type db = {
  migrationConfig:MigrationConfig;
  url: string;
}
const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/o/",
};

const db = {
  migrationConfig:migrationConfig,
  url:envOrThrow("DB_URL"),
}

export let config: APIConfig= {
  fileserverHits: 0,
  db:db,
}


export class NotFoundError extends Error {
  code: number;
  constructor(message:string){
    super(message);
    this.code = 404;
  }
}
export class PermissionError extends Error {
  code: number;
  constructor(message:string){
    super(message);
    this.code = 403;
  }
}

export class BadRequest extends Error {
  code: number;
  constructor(message:string){
    super(message);
    this.code = 400;
  }
}

