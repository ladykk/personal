import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import schema from "./schema";
import { env } from "@/env";

neonConfig.fetchConnectionCache = true;
const sql = neon(env.NEON_DATABASE_URL);
export const db = drizzle(sql, {
  schema,
});
