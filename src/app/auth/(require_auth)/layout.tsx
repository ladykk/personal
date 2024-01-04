import { env } from "@/env";
import { getAppUrl } from "@/lib/url";
import { getServerAuthSession } from "@/server/services/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RequireAuthLayout(props: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) {
    const headersList = headers();
    return redirect(
      getAppUrl(
        env.ROOT_DOMAIN,
        "auth",
        "/signin",
        new URLSearchParams({
          callbackUrl: headersList.get("x-url") ?? "",
        })
      )
    );
  }

  return <>{props.children}</>;
}
