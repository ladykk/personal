import { ClientSafeProvider, getProviders } from "next-auth/react";
import { ErrorHandle, OAuthSignIn } from "./_components";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import { AuthContainer } from "@/components/themes/auth";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | ladyk.dev",
};

type Props = {
  searchParams: {
    callbackUrl?: string;
  };
};

export default async function AuthSignInPage(props: Props) {
  const session = await getServerSession(authOptions);

  if (session) return redirect(props.searchParams.callbackUrl ?? "/");

  const providers = await getProviders().then((result) =>
    result ? Object.values(result) : []
  );

  const count = providers.reduce(
    (acc, provider) => {
      acc[provider.type] += 1;
      return acc;
    },
    {} as { [key in ClientSafeProvider["type"]]: number }
  );

  const oauths = providers.filter((provider) => provider.type === "oauth");

  return (
    <AuthContainer className="max-w-sm">
      <p className="text-center font-medium text-lg my-3 mb-5">
        Sign in to continue
      </p>
      {count.credentials + count.email > 0 && (
        <div className="flex gap-3 items-center text-sm font-medium mb-3">
          <Separator className="flex-1" />
          OR
          <Separator className="flex-1" />
        </div>
      )}
      <OAuthSignIn
        providers={oauths}
        callbackUrl={props.searchParams.callbackUrl}
      />
      <ErrorHandle />
    </AuthContainer>
  );
}
