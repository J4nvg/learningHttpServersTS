import type { Request, Response } from "express";

import { respondWithJSON, respondWithError } from "./json.js";
import { BadRequest, config, NotFoundError, PermissionError, Unauthorized } from "../config.js";
import { createChirp, deleteChirp, getAllChirps, getAllChirpsFromAuthor, getChirp } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";
import { getBearerToken, validateJWT } from "../auth.js";

const banned_array = ["kerfuffle","sharbert","fornax"];


export async function handlerChirpsValidate(req: Request) {
  type chirpie = {
    body?: string;
  };
  const chirpie = req.body;

    //Validate token first
  const userId = validateJWT(getBearerToken(req),config.auth.jwt_secret);
  if(!userId) throw new Unauthorized("Need userid");
    
  // if(chirpie.userId.length === 0 || !chirpie.userId.length) throw new BadRequest("Need userid");

  const replacer = "****";
  const maxChirpLength = 140;
  if (!chirpie.body) throw new BadRequest("No body supplied")
  if (chirpie.body.length > maxChirpLength) {
    throw new BadRequest("Chirp is too long. Max length is 140");
  }
let cleanedString = [];
  for(const word of chirpie.body.split(" ") ){
    if (banned_array.includes(word.toLowerCase())){
        cleanedString.push(replacer);
    }
    else{
        cleanedString.push(word);
    }
  }
  return {
    userId:userId,
    body: cleanedString.join(' '),
  } as NewChirp;
}


export async function handlerCreateChirp(req: Request, res: Response) {  
  
  const newChirp = await handlerChirpsValidate(req);
    const chirp = await createChirp(newChirp);
    respondWithJSON(res, 201,chirp);
}


function checkSorter(req:Request){
  let sorterQuery = req.query.sort;
  if (typeof(sorterQuery) === "string" && (sorterQuery === "asc" || sorterQuery === "desc" ) ){
    console.log("asking sql to sort",sorterQuery);
    return sorterQuery;
  }
  return ""
}

export async function handlerGetChrips(req:Request, res:Response){
  let chirps;
  let authorId = "";
  let authorIdQuery = req.query.authorId;
  if (typeof authorIdQuery === "string" && authorIdQuery.length >1) {
    authorId = authorIdQuery; 
    chirps = await getAllChirpsFromAuthor(authorId,checkSorter(req));
  }
  else{
   chirps = await getAllChirps(checkSorter(req));
  }

  respondWithJSON(res, 200,chirps);
}


export async function handlerGetChrip(req:Request, res:Response){
    const chirpId = req.params.id;
    
    const chirp = await getChirp(chirpId);
    if(!chirp){
        throw new NotFoundError('Could not find chirp') ;
    }
    respondWithJSON(res, 200,chirp);
}

export async function handlerDeleteChrip(req:Request, res:Response){
  const token = getBearerToken(req);
  const sub = validateJWT(token,config.auth.jwt_secret);  
  
  const chirpId = req.params.id;
  const chirp = await getChirp(chirpId);
    if(!chirp){
        throw new NotFoundError('Could not find chirp') ;
    }

  if(chirp.userId !== sub) throw new PermissionError("This is not your chirp.")
  await deleteChirp(chirpId);
   
  res.header("Content-Type", "application/json");
  res.status(204).send();
}