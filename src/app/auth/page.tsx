import { env } from "@/env";
import { getAppUrl } from "@/lib/url";
import { redirect } from "next/navigation";

export default function AuthPage() {
  return redirect(getAppUrl(env.NEXT_PUBLIC_ROOT_DOMAIN, "site", ""));
}
