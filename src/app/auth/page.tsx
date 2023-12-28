import { env } from "@/env";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    callbackUrl?: string;
  };
};

export default async function AuthPage(props: Props) {
  const session = await getServerSession(authOptions);

  if (!session)
    redirect(
      `${env.NEXTAUTH_URL}/signin` + props.searchParams.callbackUrl
        ? `?callbackUrl=${props.searchParams.callbackUrl}`
        : ""
    );
  else redirect(props.searchParams.callbackUrl ?? env.ROOT_DOMAIN);
}
