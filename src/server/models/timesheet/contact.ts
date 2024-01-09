import { env } from "@/env";
import { getAppUrl } from "@/lib/url";
import { type DB } from "@/server/db";
import { timesheetContacts } from "@/server/db/schema/timesheet";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import Model from "..";

const schema = z.object({
  id: z.number().default(0),
  avatarUrl: z.string().nullish().default(null),
  taxId: z.string().default(""),
  companyName: z.string().default(""),
  isHeadQuarters: z.boolean().default(true),
  branchCode: z.string().default(""),
  address: z.string().default(""),
  email: z.string().default(""),
  telNo: z.string().default(""),
  phoneNo: z.string().default(""),
  faxNo: z.string().default(""),
  contactPerson: z.string().default(""),
  contactEmail: z.string().default(""),
  contactPhoneNo: z.string().default(""),
  remark: z.string().default(""),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().nullish(),
});

const formSchema = schema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    companyName: z.string().min(1, {
      message: "Required",
    }),
    contactPerson: z.string().min(1, {
      message: "Required",
    }),
  });

const filterSchema = {
  isActive: z.boolean().optional(),
};

const idSchema = z.number().min(1, {
  message: "Required",
});

const baseSelect = {
  id: timesheetContacts.id,
  avatarId: timesheetContacts.avatarId,
  taxId: timesheetContacts.taxId,
  companyName: timesheetContacts.companyName,
  isHeadQuarters: timesheetContacts.isHeadQuarters,
  branchCode: timesheetContacts.branchCode,
  address: timesheetContacts.address,
  email: timesheetContacts.email,
  telNo: timesheetContacts.telNo,
  phoneNo: timesheetContacts.phoneNo,
  faxNo: timesheetContacts.faxNo,
  contactPerson: timesheetContacts.contactPerson,
  contactEmail: timesheetContacts.contactEmail,
  contactPhoneNo: timesheetContacts.contactPhoneNo,
  remark: timesheetContacts.remark,
  isActive: timesheetContacts.isActive,
  createdAt: timesheetContacts.createdAt,
  updatedAt: timesheetContacts.updatedAt,
};

const baseQuery = (db: DB) => db.select(baseSelect).from(timesheetContacts);

type BaseContactResult = Awaited<
  ReturnType<ReturnType<typeof baseQuery>["execute"]>
>;

const countQuery = (db: DB) =>
  db.select(Model.selects.count(timesheetContacts.id)).from(timesheetContacts);

const basePostFormat = (array: BaseContactResult) =>
  array.map((item) => ({
    ...item,
    avatarUrl: item.avatarId
      ? getAppUrl(env.ROOT_DOMAIN, "storage", `/file/${item.avatarId}`)
      : null,
  }));

const Contact = {
  schemas: {
    base: schema,
    form: formSchema,
    filters: filterSchema,
    id: idSchema,
  },
  selects: {
    base: baseSelect,
  },
  queries: {
    base: baseQuery,
    count: countQuery,
  },
  postFormat: {
    base: basePostFormat,
  },
};

export default Contact;
