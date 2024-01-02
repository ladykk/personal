import { eq, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../..";
import { accounts, users } from "@/server/db/schema/auth";
import { z } from "zod";
import {
  deleteFileByUrl,
  generatePresignedUrl,
  generatePresignedUrlInputSchema,
} from "@/server/services/r2";
import { TRPCError } from "@trpc/server";

const getProfileSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  isEmailVerified: z.boolean(),
  image: z.string().url().nullable().default(""),
  accounts: z
    .array(
      z.object({
        type: z.string(),
        provider: z.string(),
        providerAccountId: z.string(),
      })
    )
    .default([]),
});

const updateProfileSchema = z.object({
  name: z.string(),
  image: z.string().nullable(),
});

export const authProfileRouter = createTRPCRouter({
  getProfile: protectedProcedure.output(getProfileSchema).query(
    async ({ ctx }) =>
      await ctx.db
        .select({
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            isEmailVerified: sql<boolean>`${users.emailVerified} IS NOT NULL`,
            image: users.image,
          },
          account: {
            type: accounts.type,
            provider: accounts.provider,
            providerAccountId: accounts.providerAccountId,
          },
        })
        .from(users)
        .leftJoin(accounts, eq(users.id, accounts.userId))
        .where(eq(users.id, ctx.session.user.id))
        .execute()
        .then((rows) =>
          rows.reduce<Record<string, z.infer<typeof getProfileSchema>>>(
            (acc, row) => {
              const user = row.user;
              const account = row.account;

              if (!acc[user.id]) {
                acc[user.id] = {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  isEmailVerified: user.isEmailVerified,
                  image: user.image,
                  accounts: [],
                };

                if (account) {
                  acc[user.id].accounts.push({
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                  });
                }
              } else {
                if (account) {
                  acc[user.id].accounts.push({
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                  });
                }
              }
              return acc;
            },
            {}
          )
        )
        .then((rows) => {
          return Object.values(rows)[0];
        })
  ),
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ input, ctx }) => {
      // Check if user exists
      const user = await ctx.db.query.users
        .findFirst({
          where: ({ id }, { eq }) => eq(id, ctx.session.user.id),
        })
        .execute();

      // If user not found, throw error
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      // Delete old image if exists
      if (user.image && user.image !== input.image)
        await deleteFileByUrl(user.image);

      // Update user
      await ctx.db
        .update(users)
        .set({
          name: input.name,
          image: input.image,
        })
        .where(eq(users.id, ctx.session.user.id))
        .execute();
    }),
  generateAvatarPresignedUrl: protectedProcedure
    .input(generatePresignedUrlInputSchema)
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      return await generatePresignedUrl(
        ctx.session.user.id,
        { rule: "public" },
        { rule: "self", selfUserId: ctx.session.user.id },
        input
      );
    }),
});
