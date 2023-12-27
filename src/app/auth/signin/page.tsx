import { getProviders } from "next-auth/react";
import { OAuthSignIn } from "./_client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";

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
    <div className="p-5 border max-w-sm w-full rounded-lg shadow bg-white">
      <p className="text-center font-medium text-lg my-3">Login to continue</p>
      <OAuthSignIn
        providers={oauths}
        callbackUrl={props.searchParams.callbackUrl}
      />
    </div>
  );
}
