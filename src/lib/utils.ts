import { TRPCClientErrorLike } from "@trpc/client";
import { type ClassValue, clsx } from "clsx";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { ZodError, typeToFlattenedError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNamePrefix(name: string | null | undefined) {
  if (!name) return "L";

  const filtered = name.replace(/[^a-zA-Zก-๙]/g, "");
  return filtered.charAt(0).toUpperCase();
}

export function handleTRPCFormError<T extends FieldValues>(
  error: typeToFlattenedError<T, string> | null | undefined,
  setError: UseFormSetError<T>
) {
  Object.entries(error?.fieldErrors ?? {}).forEach(([key, value]) => {
    setError(key as Path<T>, {
      type: "manual",
      message: (value as string[]).join(","),
    });
  });
}
