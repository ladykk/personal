import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    callbackUrl?: string;
  };
};

export default function AuthPage(props: Props) {
  const session = getServerSession(authOptions);

  if (!session)
    redirect(
      "/auth/signin" + props.searchParams.callbackUrl
        ? `?callbackUrl=${props.searchParams.callbackUrl}`
        : ""
    );
  else redirect(props.searchParams.callbackUrl ?? "/");
}
