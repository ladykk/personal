import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import { Application, SubDomainMappings } from "./static/app";
import { extractPath, isSubDomain } from "./lib/url";

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
  const { hostname, path } = extractPath(env.NEXT_PUBLIC_ROOT_DOMAIN, req);

  // rewrites for auth pages.
  if (isSubDomain(env.NEXT_PUBLIC_ROOT_DOMAIN, hostname, "auth"))
    return NextResponse.rewrite(
      new URL(`/auth${path === "/" ? "" : path}`, req.url)
    );
  // rewrites for site pages.
  else if (isSubDomain(env.NEXT_PUBLIC_ROOT_DOMAIN, hostname, "site"))
    return NextResponse.rewrite(new URL(`/site${path}`, req.url));
  // others ignore.
  else return NextResponse.next();
}
