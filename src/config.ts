import 'dotenv/config';
import type { MigrationConfig } from "drizzle-orm/migrator";


// Api keys
export function envOrThrow(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable "${key}" is not defined.`);
  }
  return value;
}

//  Server config
export type APIConfig = {
  fileserverHits: number;
  db: Db;
  auth: Auth;
};

type Auth = {
  saltRounds: number;
  jwt_secret: string;
  jwt_std_expire: number;
  refreshToken_expire_days: number;
  polka_key: string;
  
}

const auth: Auth ={
  saltRounds: 10,
  jwt_secret: envOrThrow("JWT_SECRET"),
  jwt_std_expire: 3600,
refreshToken_expire_days: 60,
  polka_key: envOrThrow("POKA_KEY"),
}


type Db = {
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
  auth: auth,
}


// Errors

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
export class Unauthorized extends Error {
  code: number;
  constructor(message:string){
    super(message);
    this.code = 401;
  }
}

