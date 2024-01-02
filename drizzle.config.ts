import { env } from "./src/env/drizzle";
import type { Config } from "drizzle-kit";
export default {
  schema: "./src/server/db/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: `${env.NEON_DIRECT_URL}?sslmode=require`,
  },
} satisfies Config;
