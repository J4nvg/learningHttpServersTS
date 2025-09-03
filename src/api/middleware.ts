import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";


export function middlewareLogResponse(req:Request,res:Response,next:NextFunction){

    res.on("finish", () =>{
        if(res.statusCode !== 200){
        console.log(
            `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`
        )
    }
        else{
            console.log(
            `[OK] ${req.method} ${req.url} - Status: ${res.statusCode}`
        )
        }
    })
    next();
}

export function middlewareMetricsInc(req:Request,res:Response,next:NextFunction){
    config.fileserverHits += 1;
    next();
}


export function allowOnlyPost (req:Request,res:Response,next:NextFunction)  {
    if (req.method !== 'POST') {
        return res.status(401).send(`Method ${req.method} not allowed`)
    }
    next()
}