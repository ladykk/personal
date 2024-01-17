import { JSX, RefAttributes, useEffect, useState } from "react";
import { Input, InputProps } from "../ui/input";
import { useDebounce } from "usehooks-ts";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { FormItem } from "../ui/form";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

export const SearchKeywordInput = (
  props: Omit<
    JSX.IntrinsicAttributes & InputProps & RefAttributes<HTMLInputElement>,
    "defaultValue" | "onChange"
  > & {
    defaultValue: string | undefined;
    onChange: (value: string) => void;
    delay?: number;
    title?: string;
  }
) => {
  const [value, setValue] = useState(props.defaultValue || "");
  const debounce = useDebounce(value, props.delay || 800);

  useEffect(() => {
    props.onChange?.(debounce);
  }, [debounce]);

  return (
    <FormItem className={cn("w-full", props.className)}>
      <Label>{props.title ?? "Search"}</Label>
      <Input
        {...props}
        className=""
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </FormItem>
  );
};

export const BooleanDropdown = (props: {
  defaultValue: string | undefined;
  onChange: (value: string | undefined) => void;
  label?: {
    default?: string;
    true?: string;
    false?: string;
  };
  title: string;
  className?: string;
}) => {
  const [value, setValue] = useState(props.defaultValue);
  useEffect(() => {
    props.onChange?.(value);
  }, [value]);
  return (
    <FormItem className={cn("w-full", props.className)}>
      <Label>{props.title}</Label>
      <Select
        value={value ?? "-"}
        onValueChange={(value) => setValue(value === "-" ? undefined : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Active" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-">
            {props.label?.default ?? "True / False"}
          </SelectItem>
          <SelectItem value="1">{props.label?.true ?? "True"}</SelectItem>
          <SelectItem value="0">{props.label?.false ?? "False"}</SelectItem>
        </SelectContent>
      </Select>
    </FormItem>
  );
};
