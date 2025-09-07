import { hash, compare } from "bcrypt";
import { BadRequest, config, Unauthorized } from "./config.js";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
const TOKEN_ISSUER = 'chirpy';
export async function hashPassword(pwd) {
    return hash(pwd, config.auth.saltRounds);
}
export async function checkPasswordHash(pwd, hash) {
    return compare(pwd, hash);
}
export function makeJWT(userID, expiresIn, secret) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + expiresIn;
    const payload = {
        iss: TOKEN_ISSUER,
        sub: userID,
        iat,
        exp,
    };
    return jwt.sign(payload, secret);
}
export function validateJWT(tokenString, secret) {
    let decoded;
    try {
        decoded = jwt.verify(tokenString, secret);
    }
    catch (e) {
        throw new Unauthorized("Invalid token");
    }
    if (decoded.iss !== TOKEN_ISSUER) {
        throw new Unauthorized("Invalid issuer");
    }
    if (!decoded.sub) {
        throw new Unauthorized("No user ID in token");
    }
    return decoded.sub;
}
export function getBearerToken(req) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new Unauthorized('Authorization header is missing');
    }
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match || match.length < 2) {
        throw new BadRequest('Bearer token not found in Authorization header');
    }
    return match[1];
}
export function makeRefreshToken(userId) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.auth.refreshToken_expire_days);
    const refreshToken = {
        userId: userId,
        token: randomBytes(32).toString('hex'),
        expiresAt: expiresAt,
    };
    return refreshToken;
}
export function getAPIKey(req) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new Unauthorized('Authorization header is missing');
    }
    const match = authHeader.match(/^ApiKey (.+)$/);
    if (!match || match.length < 2) {
        throw new Unauthorized('Authorization header is missing');
    }
    return match[1];
}
