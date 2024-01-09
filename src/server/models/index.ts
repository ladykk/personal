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
  selects: {
    count: (column: PgColumn) => ({
      count: sql<number>`CAST(COUNT(${column}) AS INTEGER)`,
    }),
  },
};

export default Model;
