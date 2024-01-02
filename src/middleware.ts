import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";

import { extractPath } from "./lib/url";
import { SubDomainMappings } from "./static/app";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  // Don't redirect if we're in development
  if (env.VERCEL_ENV === "development") return NextResponse.next();

  // Handle subdomains
  const { hostname, path } = extractPath(req);

  // Handle Rewrite
  const subDomain = hostname.replace(`.${env.ROOT_DOMAIN}`, "");

  const mapping = Object.values(SubDomainMappings).find(
    (item) => item.subDomain === subDomain
  );

  if (!mapping) return NextResponse.next();

  const { basePath } = mapping;
  return NextResponse.rewrite(new URL(`/${basePath}${path}`, req.url));
}
