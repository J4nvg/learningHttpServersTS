import { config } from "../config.js";
export function handlerHits(req, res) {
    res.send(`Hits: ${config.fileserverHits}`);
}
