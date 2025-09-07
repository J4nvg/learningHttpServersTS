import 'dotenv/config';
// Api keys
export function envOrThrow(key) {
    const value = process.env[key];
    if (value === undefined) {
        throw new Error(`Environment variable "${key}" is not defined.`);
    }
    return value;
}
const auth = {
    saltRounds: 10,
    jwt_secret: envOrThrow("JWT_SECRET"),
    jwt_std_expire: 3600,
    refreshToken_expire_days: 60,
    polka_key: envOrThrow("POKA_KEY"),
};
const migrationConfig = {
    migrationsFolder: "./src/db/o/",
};
const db = {
    migrationConfig: migrationConfig,
    url: envOrThrow("DB_URL"),
};
export let config = {
    fileserverHits: 0,
    db: db,
    auth: auth,
};
// Errors
export class NotFoundError extends Error {
    code;
    constructor(message) {
        super(message);
        this.code = 404;
    }
}
export class PermissionError extends Error {
    code;
    constructor(message) {
        super(message);
        this.code = 403;
    }
}
export class BadRequest extends Error {
    code;
    constructor(message) {
        super(message);
        this.code = 400;
    }
}
export class Unauthorized extends Error {
    code;
    constructor(message) {
        super(message);
        this.code = 401;
    }
}
