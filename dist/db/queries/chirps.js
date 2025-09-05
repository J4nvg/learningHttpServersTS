import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps } from "../schema.js";
export async function createChirp(chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function getAllChirps() {
    return await db
        .select()
        .from(chirps);
}
export async function getChirp(chirpId) {
    const [chirp] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId));
    return chirp;
}
