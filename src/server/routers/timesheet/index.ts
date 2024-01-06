import { createTRPCRouter } from "@/server";
import { timesheetContactRouter } from "./contact";

export const timesheetRouter = createTRPCRouter({
  contact: timesheetContactRouter,
});
