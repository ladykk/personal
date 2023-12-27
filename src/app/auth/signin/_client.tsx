"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OAuthTheme } from "@/static/auth";
import { ClientSafeProvider, signIn } from "next-auth/react";
import Image from "next/image";

type Props = {
  providers: Array<ClientSafeProvider>;
  callbackUrl?: string;
};

export function OAuthSignIn(props: Props) {
  return (
    props.providers.length > 0 && (
      <div className="space-y-3">
        <div className="flex gap-3 items-center text-sm font-medium">
          <Separator className="flex-1" />
          OR
          <Separator className="flex-1" />
        </div>
        {props.providers.map((provider) => (
          <Button
            key={provider.name}
            className="w-full relative"
            variant="outline"
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: props.callbackUrl,
              })
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
