import { eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import { refreshTokens } from "../schema.js";
export async function saveRefreshToken(token) {
    const [result] = await db
        .insert(refreshTokens)
        .values(token)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function getRefreshToken(token) {
    const [result] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, token));
    return result;
}
export async function revokeToken(token) {
    await db
        .update(refreshTokens)
        .set({
        revokedAt: sql `now()`,
        updatedAt: sql `now()`
    })
        .where(eq(refreshTokens.token, token));
}
