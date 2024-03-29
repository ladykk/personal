import { TAccessControl } from "@/static/r2";
import { bigint, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const files = pgTable("file", {
  id: text("id").notNull().primaryKey(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: bigint("file_size", {
    mode: "number",
  }).notNull(),
  issuedAt: timestamp("expires_at", { mode: "date" }).notNull(),
  issuedBy: text("issued_by").references(() => users.id, {
    onDelete: "set null",
  }),
  uploadedAt: timestamp("uploaded_at", { mode: "date" }),
  readAccessControl: json("read_access_control")
    .notNull()
    .$type<TAccessControl>(),
  writeAccessControl: json("write_access_control")
    .notNull()
    .$type<TAccessControl>(),
});
