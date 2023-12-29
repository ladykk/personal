import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthError, AuthErrorCode } from "@/static/auth";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
  searchParams: {
    callbackUrl?: string;
    error?: AuthErrorCode;
  };
};

export const metadata: Metadata = {
  title: "Something went wrong | ladyk.dev",
};

export default function AuthErrorPage(props: Props) {
  const error = AuthError[props.searchParams.error ?? "Default"];
  return (
    <div className="flex justify-center items-center flex-col">
      <p className="font-medium text-lg text-center">Something went wrong</p>
      <p className="text-muted-foreground text-sm text-center">
        {error.message}
      </p>
      <Link
        href={props.searchParams.callbackUrl ?? "/"}
        className={cn(buttonVariants(), "mt-5")}
      >
        Continue
      </Link>
    </div>
  );
}
