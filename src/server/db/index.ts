import schema from "./schema";
import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const sql = postgres(env.NEON_DATABASE_URL);
export const db = drizzle(sql, {
  schema,
});
