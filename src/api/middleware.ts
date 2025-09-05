import { NextFunction, Request, Response } from "express";
import { BadRequest, config, PermissionError } from "../config.js";
import { respondWithError } from "./json.js";


export function middlewareLogResponse(req:Request,res:Response,next:NextFunction){

    res.on("finish", () =>{
        if(res.statusCode < 200 || res.statusCode > 299){
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

export function errorMiddleWare(err: Error, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500;
  let message = "Internal Server Error";

  console.log(err.message);

  if (err instanceof BadRequest) {
    statusCode = 400;
    message = err.message;
  }
  else if (err instanceof PermissionError) {
    statusCode = 403;
    message = `${statusCode} ${err.message}`;
  }

  respondWithError(res, statusCode, message);
}