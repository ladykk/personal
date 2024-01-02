import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Upload, X } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

type FileInputProps = {
  value: File | null;
  onChange: (value: File | null) => void;
  clearable?: boolean;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
};
const FileInput = (props: FileInputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <div
        className={cn(
          "justify-between flex h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 items-center gap-3 relative",
          props.disabled && "cursor-not-allowed opacity-50 ",
          props.className
        )}
      >
        <div className="flex absolute left-0 right-0 bottom-0 top-0 px-3 py-2 items-center">
          <p
            className={cn(
              "truncate ... flex-1",
              props.value ? "" : "text-muted-foreground"
            )}
          >
            {props.value?.name ?? props.placeholder ?? "Choose a file..."}
          </p>
          {!props.readOnly && (
            <div className="flex gap-1.5 translate-x-1 items-center">
              {props.clearable && props.value && (
                <Button
                  type="button"
                  onClick={() => props.onChange(null)}
                  size="sm"
                  variant="destructive"
                  className="p-1 text-xs h-fit"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <Button
                type="button"
                onClick={() => inputRef.current?.click()}
                size="sm"
                variant="outline"
                className="p-1 text-xs h-fit"
                disabled={props.disabled}
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        hidden
        value=""
        readOnly={props.readOnly}
        disabled={props.disabled}
        onChange={(e) => {
          if (e.target.files?.length) props.onChange(e.target.files[0]);
        }}
      />
    </>
  );
};

FileInput.displayName = "FileInput";

export { Input, FileInput };
