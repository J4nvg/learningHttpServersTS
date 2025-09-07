import { eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import { NewRefreshToken, refreshTokens } from "../schema.js";

export async function saveRefreshToken(token: NewRefreshToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(token)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getRefreshToken(token:string){
  const [result] = await db
  .select()
  .from(refreshTokens)
  .where(eq(refreshTokens.token,token));
  return result;
}

export async function revokeToken(token:string){
  await db
  .update(refreshTokens)
  .set({
    revokedAt: sql`now()`,
    updatedAt: sql`now()`
  })
  .where(eq(refreshTokens.token,token));
}