import { ZodObject, ZodRawShape, z } from "zod";

export const paginationInput = <T extends ZodRawShape>(filters: T) =>
  z.object({
    ...filters,
    page: z.coerce.number().min(1).default(1),
    itemsPerPage: z.coerce.number().min(1).default(10),
  });

export const paginationOutput = <T extends ZodRawShape>(data: ZodObject<T>) =>
  z.object({
    count: z.number(),
    currentPage: z.number(),
    itemsPerPage: z.number(),
    totalPages: z.number(),
    list: z.array(data),
  });
