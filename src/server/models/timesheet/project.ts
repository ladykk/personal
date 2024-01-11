import { z } from "zod";
import Contact from "./contact";
import { DB } from "@/server/db";
import { and, eq } from "drizzle-orm";
import {
  timesheetContacts,
  timesheetProjects,
} from "@/server/db/schema/timesheet";
import Model from "..";
import { getAppUrl } from "@/lib/url";
import { env } from "@/env";

const baseSchema = z.object({
  id: z.number().default(0),
  iconUrl: z.string().nullish().default(null),
  name: z.string().default(""),
  description: z.string().default(""),
  contact: Contact.schemas.base.nullish().default(null),
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
      message: "Required",
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
      description: timesheetProjects.description,
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

type BaseProjectResult = Awaited<
  ReturnType<ReturnType<typeof baseQuery>["execute"]>
>;

const countQuery = (db: DB) =>
  db.select(Model.selects.count(timesheetProjects.id)).from(timesheetProjects);

const basePostFormat = (
  item: BaseProjectResult[0]
): z.infer<typeof baseSchema> => ({
  ...item,
  contact: item.contact ? Contact.postFormat.base(item.contact) : null,
  iconUrl: item.iconId
    ? getAppUrl(env.ROOT_DOMAIN, "storage", `/file/${item.iconId}`)
    : null,
});

const formPostFormat = (
  item: z.infer<typeof baseSchema>
): z.infer<typeof formSchema> => ({
  ...item,
  contactId: item.contact ? item.contact.id : 0,
});

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
  postFormat: {
    base: basePostFormat,
    form: formPostFormat,
  },
};

export default Project;
