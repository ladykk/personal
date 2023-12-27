import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  test: publicProcedure.query(async () => {
    return "hello";
  }),
});
export type AppRouter = typeof appRouter;
