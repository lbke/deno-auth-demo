/**
 * TODO: for demonstration purpose, we store a development key
 * In production, this must instead be loaded from env or from a file
 *
 * Use "just generate-key" to generate a new key
 */

import { apiConfig } from "../core/config.ts";

console.warn(
  ` USING DEMONSTRATION KEY
  In production, prefer loading the encryption key from an environment variable or an untracked file.
  Generate a new key.txt with:

  deno run ./api/scripts/generate-key.ts

  The content of "key.txt" is a JSON representing the key. Import it to create an encryption key.
  `
);
if (!["development", "test"].includes(apiConfig.ENVIRONMENT)) {
  throw new Error(
    "Cannot use default encryption key outside of development or test environments."
  );
}
/**
 * Key created
 */
const exportedKey = {
  kty: "oct",
  k: "SxFs6WpuiiZak8kb8lOBGmfF4wy8fNPmf5yKqqtI0GpXq23J1WDGQ37azFgR9TzwDMe2cGvgEhQRJKlxRQPF25Ah6p4ql8xIb2r1LLhNuEZxa3tz9RCtkp2mBgPP588fnZZL799o9NxyQ6Omz-9UlCxXNODvSms8-zkSr29H748",
  alg: "HS512",
  key_ops: ["sign", "verify"],
  ext: true,
};

export const key = await crypto.subtle.importKey(
  "jwk",
  exportedKey,
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"]
);
