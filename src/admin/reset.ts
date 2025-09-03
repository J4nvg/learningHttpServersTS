import { Request, Response } from "express";
import { config } from "../config.js";

export function handlerResetHits(req:Request, res:Response){
    try{
    config.fileserverHits = 0;
    res.type("text").send("OK");
    }catch{
        throw new Error("Something went wrong when resetting hits counter");
    }
}
