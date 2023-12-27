import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import schema from "./schema";

export const db = drizzle(sql, {
  schema,
});
