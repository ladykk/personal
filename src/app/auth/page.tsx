import { env } from "@/env";
import { getAppUrl } from "@/lib/url";
import { authOptions } from "@/server/services/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  const session = await getServerSession(authOptions);

  if (session) return redirect(getAppUrl(env.ROOT_DOMAIN, "site", ""));
  else return redirect(getAppUrl(env.ROOT_DOMAIN, "auth", "/signin"));
}
