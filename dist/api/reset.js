import { config } from "../config.js";
export function handlerResetHits(req, res) {
    try {
        config.fileserverHits = 0;
        res.type("text").send("OK");
    }
    catch {
        throw new Error("Something went wrong when resetting hits counter");
    }
}
