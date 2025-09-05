import { respondWithJSON } from "./json.js";
import { BadRequest } from "../config.js";
const banned_array = ["kerfuffle", "sharbert", "fornax"];
export async function handlerChirpsValidate(req, res) {
    const params = req.body;
    const replacer = "****";
    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        throw new BadRequest("Chirp is too long. Max length is 140");
    }
    let cleanedString = [];
    for (const word of params.body.split(" ")) {
        if (banned_array.includes(word.toLowerCase())) {
            cleanedString.push(replacer);
        }
        else {
            cleanedString.push(word);
        }
    }
    respondWithJSON(res, 200, {
        cleanedBody: cleanedString.join(" ")
    });
}
