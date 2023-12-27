import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    EDGE_CONFIG: z.string(),
    NEON_DATABASE_URL: z.string(),
    NEON_DIRECT_URL: z.string(),
    VERCEL_ENV: z.enum(["development", "preview", "production"]),
    VERCEL_URL: z.string().optional(),
    RENDER_INTERNAL_HOSTNAME: z.string().optional(),
    PORT: z.string().optional(),
    LINE_CLIENT_ID: z.string(),
    LINE_CLIENT_SECRET: z.string(),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
