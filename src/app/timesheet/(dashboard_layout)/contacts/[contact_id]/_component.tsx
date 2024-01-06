"use client";
import { ImportContactFromVATService } from "@/components/rd-api/vat";
import {
  FormContainer,
  MainContainer,
  PageHeader,
} from "@/components/themes/timesheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getAppUrl } from "@/lib/url";
import { handleTRPCFormError } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { RouterInputs, RouterOutputs } from "@/trpc/shared";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TimesheetContactFormClientProps = {
  ROOT_DOMAIN: string;
  contactId: number;
  initialData: RouterOutputs["timesheet"]["contact"]["getContact"];
};
export function TimesheetContactFormClient(
  props: TimesheetContactFormClientProps
) {
  const router = useRouter();
  const submitBtn = useRef<HTMLButtonElement>(null);

  const form = useForm<
    RouterInputs["timesheet"]["contact"]["createOrUpdateContact"]
  >({
    defaultValues: props.initialData,
  });
  const mutation = trpc.timesheet.contact.createOrUpdateContact.useMutation({
    onSuccess: (data, variables) => {
      if (props.contactId === 0)
        router.replace(
          getAppUrl(props.ROOT_DOMAIN, "timesheet", `/contacts/${data}`)
        );
      else {
        form.reset(variables);
      }
    },

    onError: (error) =>
      handleTRPCFormError(error.data?.zodError, form.setError),
  });

  return (
    <MainContainer className="space-y-5">
      <PageHeader
        title={props.contactId === 0 ? "Add Contact" : "Edit Contact"}
        backButton
        actions={
          <div className="flex items-center gap-3">
            {props.contactId === 0 && (
              <ImportContactFromVATService
                onImport={(vat) => {
                  form.reset();
                  form.setValue("companyName", vat.companyName, {
                    shouldDirty: true,
                  });
                  form.setValue("contactPerson", vat.name, {
                    shouldDirty: true,
                  });
                  form.setValue("address", vat.address, {
                    shouldDirty: true,
                  });
                  form.setValue("taxId", vat.tid, {
                    shouldDirty: true,
                  });
                  form.setValue("isHeadQuarters", vat.isHeadQuarter, {
                    shouldDirty: true,
                  });
                  toast.info("Contact information imported!");
                }}
              />
            )}
            <Button
              type="button"
              disabled={!form.formState.isDirty}
              loading={mutation.isLoading}
              size="icon"
              onClick={submitBtn.current?.click.bind(submitBtn.current)}
            >
              <Save />
            </Button>
          </div>
        }
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            toast.promise(mutation.mutateAsync(data), {
              loading: "Saving contact information...",
              success: "Contact information saved!",
              error: "Contact information could not be saved!",
            })
          )}
        >
          <FormContainer className="flex gap-3 flex-col-reverse md:flex-row md:gap-5">
            <div className="space-y-3 flex-1">
              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 items-center">
                <FormField
                  control={form.control}
                  name="isHeadQuarters"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex gap-3 items-center h-10">
                          <Switch {...field} />
                          <FormLabel>Is Head Quaters</FormLabel>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex gap-3 items-center h-10">
                          <Switch {...field} />
                          <FormLabel>Active</FormLabel>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="branchCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tel No.</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone No.</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="faxNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fax No.</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="hidden md:block">
              <Separator orientation="vertical" />
            </div>
            <div className="flex-1 space-y-3">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Contact Person</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone No.</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remark</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[150px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <button type="submit" ref={submitBtn} hidden />
          </FormContainer>
        </form>
      </Form>
    </MainContainer>
  );
}
