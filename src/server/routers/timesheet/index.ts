import { createTRPCRouter } from "@/server";
import { timesheetContactRouter } from "./contact";
import { timesheetProjectRouter } from "./project";

export const timesheetRouter = createTRPCRouter({
  contact: timesheetContactRouter,
  project: timesheetProjectRouter,
});
