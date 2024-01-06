"use client";
import { MainContainer, PageHeader } from "@/components/themes/timesheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combo-box";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { VATResultToContact } from "@/lib/rd-api";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { RouterInputs, RouterOutputs } from "@/trpc/shared";
import { Download } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function TimesheetContactFormClient() {
  return (
    <MainContainer>
      <PageHeader
        title={"Add Contact"}
        backButton
        actions={
          <>
            <ImportFromVatService onImport={() => {}} />
          </>
        }
      />
    </MainContainer>
  );
}

type ImportFromVatServiceProps = {
  onImport: (data: ReturnType<typeof VATResultToContact>) => void;
};
export function ImportFromVatService(props: ImportFromVatServiceProps) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ReturnType<
    typeof VATResultToContact
  > | null>(null);
  const commonService = trpc.rdAPI.getVatCommonService.useQuery(undefined, {
    enabled: open,
  });

  console.log(result);

  const form = useForm<RouterInputs["rdAPI"]["getVatService"]>();
  const [provinceCode] = form.watch(["provinceCode"]);
  const amphers = commonService.data?.find(
    (province) => province.ProvinceCode === provinceCode
  )?.Amphurs;

  const mutation = trpc.rdAPI.getVatService.useMutation({
    onSuccess: (data, variables) => {
      setResult(VATResultToContact(data));
      form.reset();
    },
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Download />
        </Button>
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
            </div>

            <div className="flex justify-end gap-3 mt-3">
              <Button
                variant="destructive"
                onClick={() => {
                  setResult(null);
                }}
              >
                Cancel
              </Button>
              <Button
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
                  type="submit"
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
