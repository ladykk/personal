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

  if (mapping) {
    // Handle Rewrite
    const { basePath } = mapping;
    res = NextResponse.rewrite(new URL(`/${basePath}${path}`, req.url));

    // Handle Cors on different subdomain
    if (hostname !== `${subDomain ? `${subDomain}.` : ""}${env.ROOT_DOMAIN}`)
      res.headers.append("Access-Control-Allow-Credentials", "true");
    res.headers.append("Access-Control-Allow-Origin", `https://${hostname}`);
    res.headers.append(
      "Access-Control-Allow-Methods",
      "GET,DELETE,PATCH,POST,PUT"
    );
    res.headers.append(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
  }

  return res;
}
