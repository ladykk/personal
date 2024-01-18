"use client";
import {
  FormContainer,
  MainContainer,
  PageHeader,
} from "@/components/themes/timesheet";
import { ContactComboBox } from "@/components/timesheet/contact";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combo-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileInput, Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { fileToPresignedUrlInput, uploadFile } from "@/lib/r2";
import { getAppUrl } from "@/lib/url";
import { getNamePrefix, handleTRPCFormError } from "@/lib/utils";
import Contact from "@/server/models/timesheet/contact";
import Project from "@/server/models/timesheet/project";
import { trpc } from "@/trpc/client";
import { RouterInputs, RouterOutputs } from "@/trpc/shared";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TimesheetProjectFormClientProps = {
  ROOT_DOMAIN: string;
  projectId: number;
  initialData: RouterOutputs["timesheet"]["project"]["getProject"];
  contactsInitialData: RouterOutputs["timesheet"]["contact"]["getContacts"];
};
export default function TimesheetProjectFormClient(
  props: TimesheetProjectFormClientProps
) {
  const router = useRouter();
  const submitBtn = useRef<HTMLButtonElement>(null);

  const form = useForm<
    RouterInputs["timesheet"]["project"]["createOrUpdateContact"] & {
      files: {
        icon: File | null;
      };
    }
  >({
    defaultValues: props.initialData,
  });

  const query = trpc.timesheet.project.getProject.useQuery(props.projectId, {
    enabled: props.projectId !== 0,
    staleTime: Infinity,
    initialData: props.initialData,
  });
  const contacts = trpc.timesheet.contact.getContacts.useQuery(
    {},
    { staleTime: Infinity, initialData: props.contactsInitialData }
  );
  const mutation = trpc.timesheet.project.createOrUpdateContact.useMutation({
    onSuccess: (data) => {
      if (props.projectId === 0)
        router.replace(
          getAppUrl(props.ROOT_DOMAIN, "timesheet", `/projects/${data}`)
        );
      else query.refetch();
    },
    onError: (error) =>
      handleTRPCFormError(error.data?.zodError, form.setError),
  });
  const generateIconPresignedUrl =
    trpc.timesheet.project.generateIconPresignedUrl.useMutation();
  const name = form.watch("name");
  useEffect(() => {
    if (query.data) {
      form.reset(Project.postFormat.form(query.data), {
        keepDirty: true,
      });
    }
  }, [query.data]);

  return (
    <MainContainer className="space-y-5">
      <PageHeader
        title={props.projectId === 0 ? "Add Project" : "Edit Project"}
        backButton
        loading={query.isLoading}
        actions={
          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="icon"
              disabled={!form.formState.isDirty}
              loading={mutation.isLoading}
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
            toast.promise(
              async () => {
                if (data.files.icon) {
                  const key = await generateIconPresignedUrl.mutateAsync({
                    ...fileToPresignedUrlInput(data.files.icon),
                    projectId: props.projectId,
                  });
                  const imageResult = await uploadFile(data.files.icon, key);

                  if (imageResult.status === "error") {
                    form.setError("files.icon", {
                      message: imageResult.error,
                    });
                    throw new Error(imageResult.error);
                  }

                  data.iconUrl = getAppUrl(
                    props.ROOT_DOMAIN,
                    "storage",
                    `/file/${key}`
                  );
                }
                await mutation.mutateAsync(data);
              },
              {
                loading: "Saving project...",
                success: "Project saved!",
                error: "Project could not be saved!",
              }
            )
          )}
        >
          <FormContainer className="flex gap-3 flex-col md:flex-row md:gap-5">
            <div className="flex-1 space-y-3">
              <FormField
                name="files.icon"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Icon
                      {props.projectId === 0 && (
                        <span className="ml-1 font-medium text-destructive">
                          (available after created)
                        </span>
                      )}
                    </FormLabel>
                    <div className="flex gap-3 items-center">
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={
                            field.value
                              ? URL.createObjectURL(field.value)
                              : query.data.iconUrl
                          }
                        />
                        <AvatarFallback>{getNamePrefix(name)}</AvatarFallback>
                      </Avatar>
                      <FormControl>
                        <FileInput {...field} clearable />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
                disabled={props.projectId === 0}
              />
              <FormField
                name="remark"
                control={form.control}
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
            <div className="hidden md:block">
              <Separator orientation="vertical" />
            </div>
            <div className="space-y-3 flex-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Contact</FormLabel>
                    <FormControl>
                      <ContactComboBox
                        {...field}
                        setValue={(contact) => contact.id}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[150px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <button ref={submitBtn} type="submit" hidden />
          </FormContainer>
        </form>
      </Form>
    </MainContainer>
  );
}
