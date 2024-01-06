import { createTRPCRouter } from "..";
import { authRouter } from "./auth";
import { rdAPIRouter } from "./rd-api";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  rdAPI: rdAPIRouter,
});
export type AppRouter = typeof appRouter;
