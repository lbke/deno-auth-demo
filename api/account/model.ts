/**
 * Mongo model and business logic to manage and authenticate users
 */
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import { nanoid } from "/deps.ts";

import { getCollection } from "/core/db.ts";
import { extractJWT } from "./token-manager.ts";

export interface UserDocument {
  username: string;
  passwordHash: string;
  id: string;
}
const getUserCollection = getCollection<UserDocument>("user");

export async function getUserByToken(jwt: string) {
  const UserCollection = await getUserCollection();
  const userId = await extractJWT(jwt);
  return await UserCollection.findOne({ id: userId });
}

export async function getUserByUsername(username: string) {
  const UserCollection = await getUserCollection();
  return await UserCollection.findOne({ username });
}

export async function getUserByCredentials(username: string, password: string) {
  const potentialUser = await getUserByUsername(username);
  if (!potentialUser) {
    return null;
  }
  const passwordMatch =
    password && (await bcrypt.compare(password, potentialUser.passwordHash));
  if (!passwordMatch) {
    return null;
  }
  return potentialUser;
}

export async function createUser(username: string, password: string) {
  const UserCollection = await getUserCollection();
  const passwordHash = await bcrypt.hash(password);

  const createdUserObjectId = await UserCollection.insertOne({
    username,
    passwordHash,
    // string id to avoid relying on Mongo ObjectId
    id: nanoid(),
  });
  return await UserCollection.findOne({ _id: createdUserObjectId });
}
