import { respondWithJSON } from "./json.js";
import { BadRequest, NotFoundError } from "../config.js";
import { createChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
const banned_array = ["kerfuffle", "sharbert", "fornax"];
export async function handlerChirpsValidate(req) {
    const chirpie = req.body;
    if (chirpie.userId.length === 0 || !chirpie.userId.length)
        throw new BadRequest("Need userid");
    const replacer = "****";
    const maxChirpLength = 140;
    if (chirpie.body.length > maxChirpLength) {
        throw new BadRequest("Chirp is too long. Max length is 140");
    }
    let cleanedString = [];
    for (const word of chirpie.body.split(" ")) {
        if (banned_array.includes(word.toLowerCase())) {
            cleanedString.push(replacer);
        }
        else {
            cleanedString.push(word);
        }
    }
    return {
        userId: chirpie.userId,
        body: chirpie.body,
    };
}
export async function handlerCreateChirp(req, res) {
    const newChirp = await handlerChirpsValidate(req);
    const chirp = await createChirp(newChirp);
    respondWithJSON(res, 201, chirp);
}
export async function handlerGetChrips(req, res) {
    const chirps = await getAllChirps();
    respondWithJSON(res, 200, chirps);
}
export async function handlerGetChrip(req, res) {
    const chirpId = req.params.id;
    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError('Could not find chirp');
    }
    respondWithJSON(res, 200, chirp);
}
