import { respondWithJSON } from "./json.js";
import { createUser, getUser, updateUserCredentials } from "../db/queries/users.js";
import { BadRequest, config, Unauthorized } from "../config.js";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken, validateJWT } from "../auth.js";
import { saveRefreshToken } from "../db/queries/refreshtoken.js";
export async function handlerCreateUser(req, res) {
    const param = req.body;
    if (!param.email || !param.password)
        throw new BadRequest("Missing email or Password or both");
    const hashedPwd = await hashPassword(param.password);
    const user = await createUser({
        email: param.email,
        hashedPassword: hashedPwd,
    });
    if (!user) {
        throw new Error("Could not create user.");
    }
    respondWithJSON(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.isChirpyRed,
    });
}
async function verifyUserCredentials(body) {
    const { email, password } = body;
    if (!email || !password)
        throw new BadRequest("Missing email or Password or both");
    const user = await getUser(email);
    if (!user)
        throw new BadRequest("User was not found.");
    const checker = await checkPasswordHash(password, user.hashedPassword);
    if (!user || !checker) {
        throw new Unauthorized("Unauthorized");
    }
    return user;
}
export async function handlerLoginUser(req, res) {
    const user = await verifyUserCredentials(req.body);
    const token = makeJWT(user.id, config.auth.jwt_std_expire, config.auth.jwt_secret);
    const refresh = makeRefreshToken(user.id);
    await saveRefreshToken(refresh);
    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token,
        refreshToken: refresh.token,
        isChirpyRed: user.isChirpyRed,
    });
}
export async function handlerUpdateEmail(req, res) {
    try {
        const userIdHeader = validateJWT(getBearerToken(req), config.auth.jwt_secret);
        if (!userIdHeader)
            throw new Unauthorized("Malformed or missing access token");
        const param = req.body;
        if (!param.email || !param.password)
            throw new BadRequest("Missing email or Password or both");
        const hashedPwd = await hashPassword(param.password);
        const updatedUser = await updateUserCredentials(param.email, hashedPwd, userIdHeader);
        if (!updatedUser)
            throw new BadRequest("Something went wrong in updating the user");
        respondWithJSON(res, 200, {
            id: updatedUser.id,
            email: updatedUser.email,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
            isChirpyRed: updatedUser.isChirpyRed
        });
    }
    catch {
        throw new Unauthorized("Something went wrong in updating the user");
    }
}
