"use client";
import { VATResultToContact } from "@/lib/rd-api";
import { trpc } from "@/trpc/client";
import { RouterInputs } from "@/trpc/shared";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button, buttonVariants } from "../ui/button";
import { Download } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { ComboBox } from "../ui/combo-box";
import { Switch } from "../ui/switch";

type ImportContactFromVatService = {
  onImport: (data: ReturnType<typeof VATResultToContact>) => void;
  children?: JSX.Element;
};
export function ImportContactFromVATService(
  props: ImportContactFromVatService
) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ReturnType<
    typeof VATResultToContact
  > | null>(null);
  const commonService = trpc.rdAPI.getVatCommonService.useQuery(undefined, {
    enabled: open,
  });

  const defaultValues = {
    tin: "",
    name: "",
    provinceCode: 0,
    amphurCode: 0,
  };
  const form = useForm<RouterInputs["rdAPI"]["getVatService"]>({
    defaultValues,
  });
  const [provinceCode] = form.watch(["provinceCode"]);
  const amphers = commonService.data?.find(
    (province) => province.ProvinceCode === provinceCode
  )?.Amphurs;

  const mutation = trpc.rdAPI.getVatService.useMutation({
    onSuccess: (data, variables) => {
      setResult(VATResultToContact(data));
      form.reset(defaultValues);
    },
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {props.children ? (
          props.children
        ) : (
          <Button variant="outline" size="icon" type="button">
            <Download />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="max-w-xl">
        <SheetHeader className="mb-3">
          <SheetTitle>Import Contact From RD</SheetTitle>
          <SheetDescription>
            Using VAT Service API to import contact information by Tax ID.{" "}
            <Link
              href="https://www.rd.go.th/42535.html"
              target="_blank"
              className={cn(buttonVariants({ variant: "link", size: "fit" }))}
            >
              (More detail)
            </Link>
          </SheetDescription>
        </SheetHeader>
        {result ? (
          <div>
            <div className="border rounded-md p-3 space-y-3">
              <FormItem>
                <Label>Tax ID</Label>
                <Input readOnly value={result.tid} />
              </FormItem>
              <FormItem>
                <Label>Contact Name</Label>
                <Input readOnly value={result.name} />
              </FormItem>
              <FormItem>
                <Label>Company</Label>
                <Input readOnly value={result.companyName} />
              </FormItem>
              <FormItem>
                <Label>Address</Label>
                <Textarea readOnly value={result.address} />
              </FormItem>
              <FormItem>
                <div className="flex gap-3 h-10">
                  <Switch value={result.isHeadQuarter} />
                  <Label>Is Head Quarter</Label>
                </div>
              </FormItem>
            </div>

            <div className="flex justify-end gap-3 mt-3">
              <Button
                type="submit"
                variant="destructive"
                onClick={() => {
                  setResult(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  props.onImport(result);
                  setResult(null);
                  setOpen(false);
                }}
              >
                Import
              </Button>
            </div>
          </div>
        ) : (
          <div className="border rounded-md p-3">
            <Form {...form}>
              <form
                className="grid gap-3"
                onSubmit={form.handleSubmit(async (data) => {
                  toast.promise(mutation.mutateAsync(data), {
                    loading: "Looking up contact information...",
                    success: "Contact information found!",
                    error: "Contact information not found!",
                  });
                })}
              >
                <FormField
                  control={form.control}
                  name="tin"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-baseline">
                        <FormLabel>Tax ID</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input {...field} placeholder="Number 13 Digits" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="flex items-baseline">
                        <FormLabel>Name</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. บริษัท สเฟียร์ซอฟต์ จำกัด"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="provinceCode"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-baseline">
                        <FormLabel>Province</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <ComboBox
                          {...field}
                          onChange={(value) => {
                            form.setValue("amphurCode", undefined);
                            field.onChange(value);
                          }}
                          options={commonService.data}
                          setLabel={(province) => province.ProvinceName}
                          setValue={(province) => province.ProvinceCode}
                          loading={commonService.isLoading}
                          placeholder="Select a province..."
                          clearable
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amphurCode"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-baseline">
                        <FormLabel>Amphur</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <ComboBox
                          {...field}
                          options={amphers}
                          setLabel={(ampher) => ampher.AmphurName}
                          setValue={(ampher) => ampher.AmphurCode}
                          disabled={!provinceCode}
                          loading={commonService.isLoading}
                          placeholder={
                            !provinceCode
                              ? "Select a province first..."
                              : "Select an amphur..."
                          }
                          clearable
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  loading={mutation.isLoading}
                  disabled={!form.formState.isDirty}
                >
                  Search
                </Button>
              </form>
            </Form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
