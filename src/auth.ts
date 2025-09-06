import { hash,compare} from "bcrypt";
import { config } from "./config.js";

export async function hashPassword(pwd:string){
    return hash(pwd,config.auth.saltRounds);
}
export async function checkPasswordHash(pwd: string, hash: string) {
  return compare(pwd, hash);
}