/**
 * Run this script to log an encryption key
 * Then store it into an untracked file and rehydrate when necessary
 *
 * You need this key to generate a token
 */
const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"]
);

const exportedKey = await crypto.subtle.exportKey("jwk", key);

await Deno.writeTextFile("key.txt", JSON.stringify(exportedKey, null, 2));

console.info("Created key.txt. Do NOT track this file.");
