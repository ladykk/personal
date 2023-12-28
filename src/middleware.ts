import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";

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
  const url = req.nextUrl;

  // Get hostname of request (e.g. auth.ladyk.dev, auth.localhost:3000)
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${env.ROOT_DOMAIN}`);

  hostname.replace("www.", ""); // remove www. from domain

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // rewrites for test pages.
  if (hostname === `test.${env.ROOT_DOMAIN}`) {
    return NextResponse.rewrite(
      new URL(`/test${path === "/" ? "" : path}`, req.url)
    );
  }
}
