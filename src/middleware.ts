import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
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
  let hostname = req.headers.get("host")!.replace("www.", "");
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${req.nextUrl.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;
  const subDomain = hostname.replace(`${env.ROOT_DOMAIN}`, "").replace(".", "");

  // Get SubDomain Mapping
  const mapping = Object.values(SubDomainMappings).find(
    (item) => item.subDomain === subDomain
  );

  if (mapping) {
    // Handle Rewrite
    const { basePath } = mapping;
    const newUrl = new URL(`/${basePath}${path}`, req.url);
    console.log(`[Middleware]: Redirecting ${req.url} to ${newUrl.href}`);
    res = NextResponse.rewrite(newUrl);
  }

  return res;
}
