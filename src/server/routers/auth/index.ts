import { createTRPCRouter } from "@/server";
import { authProfileRouter } from "./profile";

export const authRouter = createTRPCRouter({
  profile: authProfileRouter,
});
