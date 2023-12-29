import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { JSX, ClassAttributes, HTMLAttributes } from "react";

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
