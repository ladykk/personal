import { JSX, ReactNode, RefAttributes, useEffect, useState } from "react";
import { Input, InputProps } from "../ui/input";
import { useDebounce } from "usehooks-ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormItem } from "../ui/form";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

export const FilterItem = (props: {
  title: string;
  className?: string;
  children: ReactNode;
}) => (
  <FormItem className={cn("w-full", props.className)}>
    <Label className=" whitespace-nowrap">{props.title}</Label>
    {props.children}
  </FormItem>
);

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
    <FilterItem title={props.title ?? "Search"}>
      <Input
        {...props}
        className=""
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </FilterItem>
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
    <FilterItem title={props.title}>
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
    </FilterItem>
  );
};
