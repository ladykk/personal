import { relations } from "drizzle-orm";
import { accounts, sessions, users } from "./auth";

export const RUsers = relations(users, ({ many }) => ({
  accounts: many(accounts),
  session: many(sessions),
}));

export const RAccounts = relations(accounts, ({ one }) => ({
  user: one(users),
}));

export const RSessions = relations(sessions, ({ one }) => ({
  user: one(users),
}));
