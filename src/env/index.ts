import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    ROOT_DOMAIN: z.string(),
    EDGE_CONFIG: z.string(),
    NEON_DATABASE_URL: z.string(),
    NEON_DIRECT_URL: z.string(),
    VERCEL_ENV: z.enum(["development", "preview", "production"]),
    VERCEL_URL: z.string().optional(),
    LINE_CLIENT_ID: z.string(),
    LINE_CLIENT_SECRET: z.string(),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string(),
    R2_PRESIGNED_URL_EXPIRES_MINS: z
      .string()
      .refine((value) => !Number.isNaN(Number(value)))
      .transform((value) => Number(value)),
    R2_API_ENDPOINT: z.string(),
    R2_BUCKET: z.string(),
    R2_ACCESS_KEY_ID: z.string(),
    R2_SECRET_ACCESS_KEY: z.string(),
  },
  isServer: typeof window === "undefined",
  clientPrefix: "NEXT_PUBLIC_",
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
