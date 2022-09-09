/**
 * Create and verify JWT tokens
 */
import { create, verify } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { key } from "./key.ts";

export const authTokenCookie = "AUTH_TOKEN";

export async function generateJWT(userId: string) {
  const jwt = await create({ alg: "HS512", typ: "JWT" }, { userId }, key);
  return jwt;
}

export async function extractJWT(jwt: string) {
  const payload = await verify(jwt, key);
  if (!payload.userId) {
    throw new Error(`JWT payload do not contain an userId`);
  }
  return payload.userId as string;
}
