import { ZodObject, ZodRawShape, z } from "zod";

export const baseInput = <T extends ZodRawShape>(options: T) =>
  z.object({
    ...options,
  });

export const arrayOutput = <T extends ZodRawShape>(data: ZodObject<T>) =>
  z.array(data);

export const paginationInput = <T extends ZodRawShape>(options: T) =>
  baseInput({
    ...options,
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
