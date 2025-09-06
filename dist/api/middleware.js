import { BadRequest, config, PermissionError, Unauthorized } from "../config.js";
import { respondWithError } from "./json.js";
export function middlewareLogResponse(req, res, next) {
    res.on("finish", () => {
        if (res.statusCode < 200 || res.statusCode > 299) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
        else {
            console.log(`[OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}
export function middlewareMetricsInc(req, res, next) {
    config.fileserverHits += 1;
    next();
}
export function allowOnlyPost(req, res, next) {
    if (req.method !== 'POST') {
        return res.status(401).send(`Method ${req.method} not allowed`);
    }
    next();
}
export function errorMiddleWare(err, req, res, next) {
    let statusCode = 500;
    let message = "Internal Server Error";
    console.log(err.message);
    if (err instanceof BadRequest) {
        statusCode = err.code;
        message = err.message;
    }
    else if (err instanceof PermissionError) {
        statusCode = err.code;
        message = `${statusCode} ${err.message}`;
    }
    else if (err instanceof Unauthorized) {
        statusCode = err.code;
        message = `${statusCode} ${err.message}`;
    }
    respondWithError(res, statusCode, message);
}
