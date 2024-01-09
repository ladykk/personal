import { z } from "zod";
import Contact from "./contact";
import { DB } from "@/server/db";
import { and, eq } from "drizzle-orm";
import {
  timesheetContacts,
  timesheetProjects,
} from "@/server/db/schema/timesheet";
import Model from "..";

const baseSchema = z.object({
  id: z.number().default(0),
  iconUrl: z.string().nullish().default(null),
  name: z.string().default(""),
  contact: Contact.schemas.base,
  remark: z.string().default(""),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().nullish(),
});

const formSchema = baseSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    contact: true,
  })
  .extend({
    name: z.string().min(1, {
      message: "Invalid contact",
    }),
    contactId: Contact.schemas.id,
  });

const formValidate = async (
  db: DB,
  userId: string,
  input: z.infer<typeof formSchema>
) => {
  // Check if contact exists
  const contactId = await Contact.queries
    .count(db)
    .where(
      and(
        eq(timesheetContacts.id, input.contactId),
        eq(timesheetContacts.createdBy, userId)
      )
    )
    .execute()
    .then((result) => {
      return result[0].count === 0 ? 0 : input.contactId;
    });

  return formSchema.parse({
    ...input,
    contactId,
  });
};

const baseQuery = (db: DB) =>
  db
    .select({
      id: timesheetProjects.id,
      iconId: timesheetProjects.iconId,
      name: timesheetProjects.name,
      contact: Contact.selects.base,
      remark: timesheetProjects.remark,
      isActive: timesheetProjects.isActive,
      createdAt: timesheetProjects.createdAt,
      updatedAt: timesheetProjects.updatedAt,
    })
    .from(timesheetProjects)
    .leftJoin(
      timesheetContacts,
      eq(timesheetProjects.contactId, timesheetContacts.id)
    );

const countQuery = (db: DB) =>
  db.select(Model.selects.count(timesheetProjects.id)).from(timesheetProjects);

const Project = {
  schemas: {
    base: baseSchema,
    form: formSchema,
  },
  validations: {
    form: formValidate,
  },
  queries: {
    base: baseQuery,
    count: countQuery,
  },
};

export default Project;
