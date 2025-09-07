import { hash,compare} from "bcrypt";
import { BadRequest, config, NotFoundError, Unauthorized } from "./config.js";
import { Request } from "express";
import { JwtPayload} from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { NewRefreshToken } from "./db/schema.js";

const TOKEN_ISSUER = 'chirpy';

export async function hashPassword(pwd:string){
    return hash(pwd,config.auth.saltRounds);
}
export async function checkPasswordHash(pwd: string, hash: string) {
  return compare(pwd, hash);
}


type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp" >;

export function makeJWT(userID: string, expiresIn: number, secret: string):string{
    const iat = Math.floor(Date.now() / 1000);
    const exp =  iat + expiresIn;
    const payload:Payload = {
        iss: TOKEN_ISSUER,
        sub: userID,
        iat,
        exp,
    }
    
    return jwt.sign(payload,secret)
}


export function validateJWT(tokenString: string, secret: string) {
  let decoded: Payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (e) {
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


export function getBearerToken(req: Request): string {
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

export function makeRefreshToken(userId:string){
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.auth.refreshToken_expire_days);

    const refreshToken:NewRefreshToken = {
        userId: userId,
        token: randomBytes(32).toString('hex'),
        expiresAt: expiresAt,
    }

    return refreshToken ;
}

export function getAPIKey(req:Request){
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