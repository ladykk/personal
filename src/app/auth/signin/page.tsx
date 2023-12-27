import { getProviders } from "next-auth/react";
import { OAuthSignIn } from "./_client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import { AuthContainer } from "@/components/themes/auth";

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

  const oauths = providers.filter((provider) => provider.type === "oauth");

  return (
    <AuthContainer className="max-w-sm">
      <p className="text-center font-medium text-lg my-3">Login to continue</p>
      <OAuthSignIn
        providers={oauths}
        callbackUrl={props.searchParams.callbackUrl}
      />
    </AuthContainer>
  );
}
