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
  let res = NextResponse.next();
  // Don't redirect if we're in development
  if (env.VERCEL_ENV === "development") return res;

  // Extract Path
  const { hostname, path, subDomain } = extractPath(env.ROOT_DOMAIN, req);

  // Get SubDomain Mapping
  const mapping = Object.values(SubDomainMappings).find(
    (item) => item.subDomain === subDomain
  );

  console.log(`Original: ${req.nextUrl.toString()}`);

  if (mapping) {
    // Handle Rewrite
    console.log("Rewriting...");
    const { basePath } = mapping;
    const newUrl = new URL(`/${basePath}${path}`, req.url);
    console.log(newUrl.toString());
    res = NextResponse.rewrite(newUrl);
  }

  return res;
}
