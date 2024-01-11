import {
  boolean,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./auth";
import { files } from "./storage";

const pgTable = pgTableCreator((name) => `timesheet_${name}`);

export const timesheetContacts = pgTable("contact", {
  id: serial("id").primaryKey(),
  // Company Info
  avatarId: text("avatar_id").references(() => files.id, {
    onDelete: "set null",
  }),
  taxId: text("tax_id").notNull().default(""),
  companyName: text("company_name").notNull(),
  isHeadQuarters: boolean("is_headquarters").notNull().default(true),
  branchCode: text("branch_code").notNull().default(""),
  address: text("address").notNull().default(""),
  email: text("email").notNull().default(""),
  telNo: text("tel_no").notNull().default(""),
  phoneNo: text("phone_no").notNull().default(""),
  faxNo: text("fax_no").notNull().default(""),
  // Contact Info
  contactPerson: text("contact_person").notNull(),
  contactEmail: text("contact_email").notNull().default(""),
  contactPhoneNo: text("contact_phone_no").notNull().default(""),
  // Remark
  remark: text("remark").notNull().default(""),
  // Metadata
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(new Date()),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at"),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const timesheetProjects = pgTable("project", {
  id: serial("id").primaryKey(),
  // Project Info
  iconId: text("icon_id").references(() => files.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  contactId: integer("contact_id").references(() => timesheetContacts.id, {
    onDelete: "restrict",
  }),
  // Remark
  remark: text("remark").notNull().default(""),
  // Metadata
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(new Date()),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at"),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
});
