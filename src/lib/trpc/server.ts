import { appRouter } from "@/server/routers";
import { t } from "@/server/trpc";
import { createCallerFactory } from "@trpc/server";

const createCaller = t.createCallerFactory(appRouter);
export const trpc = createCaller({});
