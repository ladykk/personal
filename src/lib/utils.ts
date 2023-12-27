import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNamePrefix(name: string | null | undefined) {
  if (!name) return "L";

  const filtered = name.replace(/[^a-zA-Z]/g, "");
  return filtered.charAt(0).toUpperCase();
}
