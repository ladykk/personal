import { env } from "@/env";
import SiteClient from "./_client";

export default function SitePage() {
  return <SiteClient ROOT_DOMAIN={env.NEXT_PUBLIC_ROOT_DOMAIN} />;
}
