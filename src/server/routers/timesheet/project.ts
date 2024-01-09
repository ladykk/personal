import { createTRPCRouter, protectedProcedure } from "@/server";
import Project from "@/server/models/timesheet/project";
import Model from "@/server/models";
import { and, eq } from "drizzle-orm";
import { timesheetProjects } from "@/server/db/schema/timesheet";
import { TRPCError } from "@trpc/server";
import {
  deleteFileById,
  generatePresignedUrl,
  generatePresignedUrlInputSchema,
  getIdFromUrl,
} from "@/server/services/r2";

export const timesheetProjectRouter = createTRPCRouter({
  createOrUpdateContact: protectedProcedure
    .input(Project.schemas.form)
    .output(Model.schemas.integerId)
    .mutation(async ({ input: raw, ctx }) => {
      const { id, iconUrl, ...data } = await Project.validations.form(
        ctx.db,
        ctx.session.user.id,
        raw
      );

      return await ctx.db.transaction(async (trx) => {
        if (id) {
          // Find existing project
          const project = await Project.queries
            .base(trx)
            .where(
              and(
                eq(timesheetProjects.id, id),
                eq(timesheetProjects.createdBy, ctx.session.user.id)
              )
            )
            .limit(1)
            .execute();

          if (project.length === 0)
            throw new TRPCError({
              code: "NOT_FOUND",
            });

          if (project[0].iconId && project[0].iconId !== getIdFromUrl(iconUrl))
            await deleteFileById(project[0].iconId);

          // Update existing project
          await trx
            .update(timesheetProjects)
            .set({
              ...data,
              id,
              iconId: getIdFromUrl(iconUrl),
              updatedBy: ctx.session.user.id,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(timesheetProjects.id, id),
                eq(timesheetProjects.createdBy, ctx.session.user.id)
              )
            )
            .execute();

          return id;
        } else {
          // Create new project
          const result = await trx
            .insert(timesheetProjects)
            .values({
              ...data,
              iconId: getIdFromUrl(iconUrl),
              createdBy: ctx.session.user.id,
            })
            .returning({
              id: timesheetProjects.id,
            })
            .execute();

          return result[0].id;
        }
      });
    }),
  generateIconPresignedUrl: protectedProcedure
    .input(
      generatePresignedUrlInputSchema.extend({
        projectId: Model.schemas.integerId,
      })
    )
    .output(Model.schemas.stringId)
    .mutation(async ({ input, ctx }) => {
      const { projectId, ...options } = input;
      const project = await Project.queries
        .count(ctx.db)
        .where(
          and(
            eq(timesheetProjects.id, projectId),
            eq(timesheetProjects.createdBy, ctx.session.user.id)
          )
        )
        .execute();

      if (project[0].count === 0) throw new TRPCError({ code: "NOT_FOUND" });

      return await generatePresignedUrl(
        ctx.session.user.id,
        { rule: "self", selfUserId: ctx.session.user.id },
        { rule: "self", selfUserId: ctx.session.user.id },
        options
      );
    }),
});
