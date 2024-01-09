import { createTRPCRouter, protectedProcedure } from "@/server";
import { timesheetContacts } from "@/server/db/schema/timesheet";
import Model from "@/server/models";
import Contact from "@/server/models/timesheet/contact";
import { paginationInput, paginationOutput } from "@/server/services/api";
import {
  deleteFileById,
  generatePresignedUrl,
  generatePresignedUrlInputSchema,
  getIdFromUrl,
} from "@/server/services/r2";
import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";

export const timesheetContactRouter = createTRPCRouter({
  getPaginateContacts: protectedProcedure
    .input(paginationInput(Contact.schemas.filters))
    .output(paginationOutput(Contact.schemas.base))
    .query(async ({ input, ctx }) => {
      const { page, itemsPerPage, isActive } = input;

      const whereClause = and(
        eq(timesheetContacts.createdBy, ctx.session.user.id),
        // Filter: isActive
        typeof isActive === "boolean"
          ? eq(timesheetContacts.isActive, isActive)
          : undefined
      );

      const count = await Contact.queries
        .count(ctx.db)
        .where(whereClause)
        .execute();

      const result = await Contact.queries
        .base(ctx.db)
        .where(whereClause)
        .offset((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .execute();

      return {
        count: count[0].count,
        currentPage: page,
        itemsPerPage,
        totalPages: Math.ceil(count[0].count / itemsPerPage),
        list: Contact.postFormat.base(result),
      };
    }),
  getContact: protectedProcedure
    .input(Model.schemas.integerId)
    .output(Contact.schemas.base)
    .query(async ({ input, ctx }) => {
      const result = await Contact.queries
        .base(ctx.db)
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

      return Contact.postFormat.base(result)[0];
    }),
  createOrUpdateContact: protectedProcedure
    .input(Contact.schemas.form)
    .output(Model.schemas.integerId)
    .mutation(async ({ input, ctx }) => {
      // Extract id from input
      const { id, avatarUrl, ...data } = input;

      return await ctx.db.transaction(async (trx) => {
        if (id) {
          // Find existing contact
          const contact = await Contact.queries
            .base(trx)
            .where(
              and(
                eq(timesheetContacts.id, id),
                eq(timesheetContacts.createdBy, ctx.session.user.id)
              )
            )
            .limit(1)
            .execute();

          if (contact.length === 0)
            throw new TRPCError({
              code: "NOT_FOUND",
            });

          if (
            contact[0].avatarId &&
            contact[0].avatarId !== getIdFromUrl(avatarUrl)
          )
            await deleteFileById(contact[0].avatarId);

          // Update existing contact
          await trx
            .update(timesheetContacts)
            .set({
              ...data,
              id,
              avatarId: getIdFromUrl(avatarUrl),
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
              avatarId: getIdFromUrl(avatarUrl),
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
  generateAvatarPresignedUrl: protectedProcedure
    .input(
      generatePresignedUrlInputSchema.extend({
        contactId: Model.schemas.integerId,
      })
    )
    .output(Model.schemas.stringId)
    .mutation(async ({ input, ctx }) => {
      const { contactId, ...options } = input;

      // Check if contact exists
      const contact = await Contact.queries
        .count(ctx.db)
        .where(
          and(
            eq(timesheetContacts.id, contactId),
            eq(timesheetContacts.createdBy, ctx.session.user.id)
          )
        )
        .execute();

      if (contact[0].count === 0) throw new TRPCError({ code: "NOT_FOUND" });

      return await generatePresignedUrl(
        ctx.session.user.id,
        { rule: "self", selfUserId: ctx.session.user.id },
        {
          rule: "self",
          selfUserId: ctx.session.user.id,
        },
        options
      );
    }),
});
