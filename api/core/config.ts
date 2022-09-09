/**
 * Proper loading of env variables with type safety
 */
import { dotenv } from "/deps.ts";
const { config: dotenvConfig } = dotenv;
const loadConfig = () => {
  const config = dotenvConfig({
    /**
     * Will check that variables are either defined in environment or .env,
     * based on variables listed in .env.example
     */
    safe: true,
  });
  return config as {
    MONGO_URI: string;
    ENVIRONMENT: string;
  };
};
export const apiConfig = loadConfig();
