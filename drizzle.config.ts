import { env } from "./src/env/drizzle";
import type { Config } from "drizzle-kit";
export default {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: `${env.POSTGRES_URL}?sslmode=require`,
  },
} satisfies Config;
