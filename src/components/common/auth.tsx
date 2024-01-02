"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Spinner } from "../ui/spinner";
import { Button, buttonVariants } from "../ui/button";
import { LogIn, LogOut, UserCog } from "lucide-react";
import { Fragment } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getNamePrefix } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import { getAppUrl } from "@/lib/url";

type AuthSectionProps = {
  buttonVariantsProps?: VariantProps<typeof buttonVariants>;
  buttonClassName?: string;
  ROOT_DOMAIN: string;
};
export const AuthSection = (props: AuthSectionProps) => {
  const { data: session, status } = useSession();
  return (
    <div className="flex items-center gap-2">
      {status === "loading" ? (
        <Spinner />
      ) : status === "authenticated" ? (
        <Fragment>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2 hover:cursor-pointer">
                <Avatar className="w-10 h-10 border">
                  <AvatarImage src={session?.user?.image} />
                  <AvatarFallback>
                    {getNamePrefix(session?.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant={props.buttonVariantsProps?.variant ?? "outline"}
                  className="hidden sm:block"
                >
                  Welcome, {session?.user?.name ?? session?.user?.email}!
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={getAppUrl(props.ROOT_DOMAIN, "auth", "/account")}>
                <DropdownMenuItem>
                  <UserCog className="mr-1.5 p-0.5" />
                  Manage Account
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() =>
                  toast.promise(() => signOut(), {
                    loading: "Signing out...",
                    success: "Signed out successfully",
                    error: "Cannot sign out, please try again.",
                  })
                }
              >
                <LogOut className="mr-1.5 p-0.5" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Fragment>
      ) : (
        <Fragment>
          <Button
            variant={props.buttonVariantsProps?.variant ?? "outline"}
            size="icon"
            onClick={() =>
              toast.promise(() => signIn(), {
                loading: "Taking you to sign in page...",
                error: "Cannot sign in, please try again.",
              })
            }
          >
            <LogIn className="mr-1.5 p-0.5" />
          </Button>
        </Fragment>
      )}
    </div>
  );
};
