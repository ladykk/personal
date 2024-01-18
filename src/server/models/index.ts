import { sql } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import { z } from "zod";

const Model = {
  schemas: {
    integerId: z.number().min(1, {
      message: "Required",
    }),
    stringId: z.string().min(1, {
      message: "Required",
    }),
  },
  searchParams: {
    string: z.string().optional(),
    boolean: z
      .string()
      .transform((value) => value === "1")
      .optional(),
    number: z
      .string()
      .refine((value) => !isNaN(Number(value)), "Invalid number input.")
      .transform((value) => Number(value))
      .optional(),
  },
  selects: {
    count: (column: PgColumn) => ({
      count: sql<number>`CAST(COUNT(${column}) AS INTEGER)`,
    }),
  },
};

export default Model;
