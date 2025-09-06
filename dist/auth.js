import { hash, compare } from "bcrypt";
import { config } from "./config.js";
export async function hashPassword(pwd) {
    return hash(pwd, config.auth.saltRounds);
}
export async function checkPasswordHash(pwd, hash) {
    return compare(pwd, hash);
}
