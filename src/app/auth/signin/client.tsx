"use client";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "@/lib/search-params";
import { OAuthTheme, SignInError, AuthSignInErrorCode } from "@/static/auth";
import { ClientSafeProvider, signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  providers: Array<ClientSafeProvider>;
  callbackUrl?: string;
};

export function OAuthSignIn(props: Props) {
  return (
    props.providers.length > 0 && (
      <div className="space-y-3">
        {props.providers.map((provider) => (
          <Button
            key={provider.name}
            className="w-full relative"
            variant="outline"
            onClick={() =>
              toast.promise(
                signIn(provider.id, {
                  callbackUrl: props.callbackUrl,
                }),
                {
                  loading: `Signing with "${provider.name}"`,
                  error: `Cannot sign in with "${provider.name}", please try again.`,
                }
              )
            }
          >
            <Image
              src={OAuthTheme[provider.id]?.logo ?? ""}
              alt={provider.id}
              width={25}
              height={25}
              className="absolute left-3"
            />
            Continue with {provider.name}
          </Button>
        ))}
      </div>
    )
  );
}

export function ErrorHandle() {
  const searchParams = useSearchParams({
    error: "" as AuthSignInErrorCode,
  });

  // Add Toast when error is not null
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchParams.values.error.length > 0)
        toast.error("Cannot sign in", {
          description:
            SignInError[searchParams.values.error]?.message ??
            SignInError["Default"].message,
        });
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return null;
}
