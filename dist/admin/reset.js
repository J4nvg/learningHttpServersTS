import { config, envOrThrow, PermissionError } from "../config.js";
import { deleteUsers } from "../db/queries/users.js";
export async function handlerResetHits(req, res) {
    if (envOrThrow("PLATFORM") !== "dev") {
        throw new PermissionError("Forbidden");
    }
    try {
        await deleteUsers();
        config.fileserverHits = 0;
        res.type("text").send("OK");
    }
    catch {
        throw new Error("Something went wrong when resetting hits counter");
    }
}
