import { getBearerToken, makeJWT } from "../auth.js";
import { BadRequest, config, Unauthorized } from "../config.js";
import { getRefreshToken, revokeToken } from "../db/queries/refreshtoken.js";
import { respondWithJSON } from "./json.js";
export async function handlerRefresh(req, res) {
    const bearer = getBearerToken(req);
    const rt = await getRefreshToken(bearer);
    if (!rt)
        throw new Unauthorized("Unauthorized");
    const now = new Date();
    if (rt.expiresAt <= now || rt.revokedAt) {
        throw new Unauthorized("Unauthorized");
    }
    respondWithJSON(res, 200, {
        token: makeJWT(rt.userId, config.auth.jwt_std_expire, config.auth.jwt_secret),
    });
}
export async function handlerRevoke(req, res) {
    const token = getBearerToken(req);
    if (!token)
        throw new BadRequest("No token found in header");
    const token_db = await getRefreshToken(token);
    if (!token_db)
        throw new Unauthorized("Unauthorized");
    revokeToken(token);
    res.header("Content-Type", "application/json");
    res.status(204).send();
}
// Unauthorized 401
