import { config, NotFoundError, Unauthorized } from "../config.js";
import { getUserById, upgradeUser } from "../db/queries/users.js";
import { getAPIKey } from "../auth.js";
// In a real project it would be better to use ZOD for validation.
export async function handlerPolkaUpgrade(req, res) {
    const apiKey = getAPIKey(req);
    if (apiKey !== config.auth.polka_key) {
        throw new Unauthorized("API key doesnt match.");
    }
    const body = req.body;
    if (body.event !== "user.upgraded") {
        res.header("Content-Type", "application/json");
        res.status(204).send();
    }
    else {
        const reqUserId = body.data.userId;
        const user = await getUserById(reqUserId);
        if (!user)
            throw new NotFoundError("User not found");
        await upgradeUser(reqUserId);
        res.header("Content-Type", "application/json");
        res.status(204).send();
    }
}
