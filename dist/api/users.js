import { respondWithJSON } from "./json.js";
import { createUser, getUser } from "../db/queries/users.js";
import { BadRequest, Unauthorized } from "../config.js";
import { checkPasswordHash, hashPassword } from "../auth.js";
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
    respondWithJSON(res, 201, user);
}
export async function handlerLoginUser(req, res) {
    const param = req.body;
    if (!param.email || !param.password)
        throw new BadRequest("Missing email or Password or both");
    const user = await getUser(param.email);
    const checker = await checkPasswordHash(param.password, user.hashedPassword);
    if (!user || !checker) {
        throw new Unauthorized("Unauthorized");
    }
    respondWithJSON(res, 200, user);
}
