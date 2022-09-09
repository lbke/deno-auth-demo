import { mongo } from "/deps.ts";
import { apiConfig } from "/core/config.ts";
const { MongoClient } = mongo;

/*
export function getAppDbFromContext(ctx: Ctx) {
  return ctx.app.state.db as mongo.Database;
}
*/

const client = new MongoClient();

/**
 * Let you get the app database from anywhere
 */
export async function getDb(): Promise<mongo.Database> {
  return await clientPromise;
}

/**
 * Closure that let's you consume a collection
 * without having to pass the db around
 *
 * That's the simplest pattern we could imagine to
 * avoid loading the db from middleware context everytime and avoid
 * arguments drilling, similar to how Mongoose lets you import models.
 * @param collectionName
 * @returns
 *
 * @example
 * const getUserCollection = getCollection("user")
 * // in methods:
 * const UserCollection = await getUserCollection()
 */
export function getCollection<T = any>(collectionName: string) {
  return async function waitForCollection() {
    const db = await getDb();
    return db.collection<T>(collectionName);
  };
}

let clientPromise: Promise<mongo.Database>;
/**
 * This function can be called multiple times, it will only
 * ever create one global client thanks to a global promise
 */
export async function connectToAppDb() {
  try {
    if (clientPromise) {
      await clientPromise;
    } else {
      clientPromise = client.connect(apiConfig.MONGO_URI);
      await clientPromise;
    }
    console.info("Database successfully connected");
  } catch (err) {
    console.error("Could not connect to database", apiConfig.MONGO_URI, err);
    Deno.exit(1);
  }
}
