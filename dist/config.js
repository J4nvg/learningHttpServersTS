import 'dotenv/config';
export function envOrThrow(key) {
    const value = process.env[key];
    if (value === undefined) {
        throw new Error(`Environment variable "${key}" is not defined.`);
    }
    return value;
}
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
};
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
