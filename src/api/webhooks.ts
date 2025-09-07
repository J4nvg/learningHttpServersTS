import { Request, Response } from "express";
import { BadRequest, config, NotFoundError, Unauthorized } from "../config.js";
import { getUser, getUserById, upgradeUser } from "../db/queries/users.js";
import { getAPIKey } from "../auth.js";

type expectedShape ={
    event: string,
    data: {
        userId: string,
    }
}

// In a real project it would be better to use ZOD for validation.

export async function handlerPolkaUpgrade(req:Request,res:Response){
    const apiKey = getAPIKey(req);
    if(apiKey !== config.auth.polka_key){
        throw new Unauthorized("API key doesnt match.")
    }
    
    const body:expectedShape = req.body;
    if(body.event !== "user.upgraded"){
          res.header("Content-Type", "application/json");
          res.status(204).send();
    }
    else{

    
    const reqUserId = body.data.userId;
    const user = await getUserById(reqUserId);
    if(!user) throw new NotFoundError("User not found");
    await upgradeUser(reqUserId);
    res.header("Content-Type", "application/json");
    res.status(204).send();
    }       
}