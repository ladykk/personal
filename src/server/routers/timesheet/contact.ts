import { env } from "@/env";
import { getAppUrl } from "@/lib/url";
import { createTRPCRouter, protectedProcedure } from "@/server";
import { timesheetContacts } from "@/server/db/schema/timesheet";
import { getIdFromUrl } from "@/server/services/r2";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const contactSchema = z.object({
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
const contactFormSchema = contactSchema
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
  })
  .superRefine((data) => {
    const { avatarUrl, ...rest } = data;
    return {
      ...rest,
      avatarId: getIdFromUrl(avatarUrl),
    };
  });

export const timesheetContactRouter = createTRPCRouter({
  getContact: protectedProcedure
    .input(z.number())
    .output(contactSchema)
    .query(async ({ input, ctx }) => {
      const result = await ctx.db
        .select({
          id: timesheetContacts.id,
          avatar_url: timesheetContacts.avatarId,
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
        })
        .from(timesheetContacts)
        .where(
          and(
            eq(timesheetContacts.id, input),
            eq(timesheetContacts.createdBy, ctx.session.user.id)
          )
        )
        .limit(1)
        .execute();

      if (result.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      result.map((item) => {
        item.avatar_url = item.avatar_url
          ? getAppUrl(env.ROOT_DOMAIN, "storage", `/file/${item.avatar_url}`)
          : null;
      });
      return result[0];
    }),
  createOrUpdateContact: protectedProcedure
    .input(contactFormSchema)
    .output(z.number())
    .mutation(async ({ input, ctx }) => {
      // Extract id from input
      const { id, avatarUrl, ...data } = input;

      return await ctx.db.transaction(async (trx) => {
        if (id) {
          // Find existing contact
          const existing = await trx
            .select({
              id: timesheetContacts.id,
            })
            .from(timesheetContacts)
            .where(
              and(
                eq(timesheetContacts.id, id),
                eq(timesheetContacts.createdBy, ctx.session.user.id)
              )
            )
            .limit(1)
            .execute();

          if (existing.length === 0)
            throw new TRPCError({
              code: "NOT_FOUND",
            });
          console.log(data);

          // Update existing contact
          await trx
            .update(timesheetContacts)
            .set({
              ...data,
              id,
              updatedBy: ctx.session.user.id,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(timesheetContacts.id, id),
                eq(timesheetContacts.createdBy, ctx.session.user.id)
              )
            )
            .execute();

          return id;
        } else {
          // Create new contact
          const result = await trx
            .insert(timesheetContacts)
            .values({
              ...data,
              createdBy: ctx.session.user.id,
            })
            .returning({
              id: timesheetContacts.id,
            })
            .execute();

          return result[0].id;
        }
      });
    }),
});
