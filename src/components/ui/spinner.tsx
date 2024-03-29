import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import {
  JSX,
  ClassAttributes,
  HTMLAttributes,
  useState,
  useEffect,
} from "react";

export const Spinner = (
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLDivElement> &
    HTMLAttributes<HTMLDivElement>
) => {
  return (
    <div {...props} className={cn("w-5 h-5", props.className)}>
      <Loader2Icon className="w-full h-full animate-spin" />
    </div>
  );
};

type ScreenSpinnerProps = {
  open?: boolean;
};
export const ScreenSpinner = (props: ScreenSpinnerProps) => {
  const open = props.open ?? true;
  return open ? (
    <div
      data-state={open ? "open" : "closed"}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex justify-center items-center"
      )}
    >
      <Spinner className="w-16 h-16 text-white/80" />
    </div>
  ) : null;
};
