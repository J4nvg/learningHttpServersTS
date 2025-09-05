import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { BadRequest } from "../config.js";
export async function handlerCreateUser(req, res) {
    const { email } = req.body;
    if (!email)
        throw new BadRequest("Missing email");
    const user = await createUser({ email });
    respondWithJSON(res, 201, user);
}
