import { asc, desc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getAllChirps(sorted?:string){
  if( sorted === "asc"){
  return await db
  .select()
  .from(chirps)
  .orderBy(asc(chirps.createdAt));
    }
  if( sorted === "desc"){
      return await db
  .select()
  .from(chirps)
  .orderBy(desc(chirps.createdAt));
    }
}

export async function getAllChirpsFromAuthor(id:string,sorted?:string){
  if( sorted === "asc"){
  return await db
  .select()
  .from(chirps)
  .where(eq(chirps.userId,id))
  .orderBy(asc(chirps.createdAt));
  }
  if( sorted === "desc"){
  return await db
  .select()
  .from(chirps)
  .where(eq(chirps.userId,id))
  .orderBy(desc(chirps.createdAt));
  }
}


export async function getChirp(chirpId:string){
  const [chirp] =  await db
  .select()
  .from(chirps)
  .where(eq(chirps.id,chirpId));
  return chirp;
}

export async function deleteChirp(chirpId:string){
  await db
  .delete(chirps)
  .where(eq(chirps.id,chirpId));
}