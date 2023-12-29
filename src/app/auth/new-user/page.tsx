import { AuthContainer } from "@/components/themes/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNamePrefix } from "@/lib/utils";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { RedirectCountdown } from "./_components";

type Props = {
  searchParams: {
    callbackUrl?: string;
  };
};

export default async function AuthNewUserPage(props: Props) {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/auth/error?error=AccessDenied");

  return (
    <AuthContainer className="max-w-sm space-y-3">
      <p className="text-center font-medium text-lg my-3">
        Welcome to ladyk.dev
      </p>
      <Avatar className="w-20 h-20 mx-auto">
        <AvatarImage src={session.user.image ?? ""} />
        <AvatarFallback>{getNamePrefix(session.user.name)}</AvatarFallback>
      </Avatar>
      <p className="font-medium text-center">
        {session.user.name ?? session.user.email}
      </p>
      <RedirectCountdown
        seconds={5}
        callbackUrl={props.searchParams.callbackUrl}
      />
    </AuthContainer>
  );
}
