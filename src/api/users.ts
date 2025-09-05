import { NextFunction, Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { BadRequest } from "../config.js";
import { nextTick } from "process";

export async function handlerCreateUser(req: Request, res: Response) {
  const {email} = req.body as {email?: string};
  if (!email) throw new BadRequest("Missing email");
const user = await createUser({email});
    respondWithJSON(res, 201,user);
}
