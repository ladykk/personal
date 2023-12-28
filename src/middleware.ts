import { env } from "@/env";
import { NextURL } from "next/dist/server/web/next-url";
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

const subDomainMappings = {
  site: "",
  auth: "auth",
} as const;

type SubDomain = keyof typeof subDomainMappings;

const extractPath = (req: NextRequest) => {
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${env.ROOT_DOMAIN}`)
    .replace("www.", "");
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${req.nextUrl.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  return { hostname, path, searchParams };
};

const isSubDomain = (hostName: string, subDomain: SubDomain) =>
  hostName ===
  `${
    subDomainMappings[subDomain].length > 0
      ? `${subDomainMappings[subDomain]}.`
      : ""
  }${env.ROOT_DOMAIN}`;

export default async function middleware(req: NextRequest) {
  // Don't redirect if we're in development
  if (env.VERCEL_ENV === "development") return NextResponse.next();

  // Handle subdomains
  const { hostname, path } = extractPath(req);

  // rewrites for auth pages.
  if (isSubDomain(hostname, "auth"))
    return NextResponse.rewrite(
      new URL(`/auth${path === "/" ? "" : path}`, req.url)
    );
  else if (isSubDomain(hostname, "site"))
    return NextResponse.rewrite(new URL(`/site${path}`, req.url));
  else return NextResponse.next();
}
