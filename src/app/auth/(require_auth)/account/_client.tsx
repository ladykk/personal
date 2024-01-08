"use client";
import { AuthContainer } from "@/components/themes/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileInput, Input } from "@/components/ui/input";
import { fileToPresignedUrlInput, uploadFile } from "@/lib/r2";
import { getAppUrl } from "@/lib/url";
import { getNamePrefix } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { RouterInputs, RouterOutputs } from "@/trpc/shared";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  profile: RouterOutputs["auth"]["profile"]["getProfile"];
  ROOT_DOMAIN: string;
};

export default function AuthAccountClient(props: Props) {
  const profile = trpc.auth.profile.getProfile.useQuery(undefined, {
    initialData: props.profile,
  });
  const updateProfile = trpc.auth.profile.updateProfile.useMutation({
    onSuccess: (_, variables) => {
      profile.refetch();
      profileForm.reset({
        ...variables,
        files: {
          image: null,
        },
      });
    },
  });
  const generateAvatarPresignedUrl =
    trpc.auth.profile.generateAvatarPresignedUrl.useMutation();

  const profileForm = useForm<
    RouterInputs["auth"]["profile"]["updateProfile"] & {
      files: {
        image: File | null;
      };
    }
  >({
    defaultValues: {
      name: profile.data?.name ?? undefined,
      image: profile.data?.image ?? undefined,
    },
  });
  const name = profileForm.watch("name");

  return (
    <AuthContainer className=" max-w-xl">
      <div className="flex gap-5">
        <div className="space-y-3 flex-1 flex-shrink-0">
          <p className="font-bold">Profile</p>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit((data) =>
                toast.promise(
                  async () => {
                    // If the user has uploaded a new image, we need to upload it to S3
                    // and then update the profile with the new image URL.
                    if (data.files.image) {
                      // Generate a presigned URL for the image upload
                      const key = await generateAvatarPresignedUrl.mutateAsync(
                        fileToPresignedUrlInput(data.files.image)
                      );
                      // Upload the image to S3
                      const imageResult = await uploadFile(
                        data.files.image,
                        key,
                        props.ROOT_DOMAIN
                      );

                      // If the image upload failed, we need to stop the profile update
                      if (imageResult.status === "error") {
                        profileForm.setError("files.image", {
                          message: imageResult.error,
                        });
                        throw new Error(imageResult.error);
                      }

                      // Update the profile with the new image URL
                      data.image = getAppUrl(
                        props.ROOT_DOMAIN,
                        "storage",
                        `/file/${key}`
                      );
                    }
                    updateProfile.mutateAsync(data);
                  },
                  {
                    loading: "Updating profile...",
                    success: "Profile updated!",
                    error: "Failed to update profile",
                  }
                )
              )}
              className="space-y-3"
            >
              <FormField
                name="files.image"
                control={profileForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <div className="flex gap-3 items-center">
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={
                            field.value
                              ? URL.createObjectURL(field.value)
                              : profile.data.image
                          }
                          alt={name}
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
              />
              <FormField
                name="name"
                control={profileForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                loading={updateProfile.isLoading}
                disabled={!profileForm.formState.isDirty}
              >
                Update
              </Button>
            </form>
          </Form>
        </div>
        {/* <div>
          <Separator orientation="vertical" />
        </div>
        <div className="flex-1 flex-shrink-0"></div> */}
      </div>
    </AuthContainer>
  );
}
