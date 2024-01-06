import { createTRPCRouter } from "..";
import { authRouter } from "./auth";
import { rdAPIRouter } from "./rd-api";
import { timesheetRouter } from "./timesheet";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  rdAPI: rdAPIRouter,
  timesheet: timesheetRouter,
});
export type AppRouter = typeof appRouter;
