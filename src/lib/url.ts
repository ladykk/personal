import { Application, SubDomainMappings } from "@/static/app";
import { NextRequest } from "next/server";

export const getAppUrl = (
  ROOT_DOMAIN: string,
  app: Application,
  path: string,
  searchParams: URLSearchParams = new URLSearchParams()
) => {
  const isDev = ROOT_DOMAIN.startsWith("localhost");
  return isDev
    ? `http://${ROOT_DOMAIN}/${
        SubDomainMappings[app].basePath
      }${path}${searchParams?.toString()}`
    : `https://${
        SubDomainMappings[app].subDomain.length > 0
          ? `${SubDomainMappings[app].subDomain}.`
          : ""
      }${ROOT_DOMAIN}${path}${searchParams.toString()}`;
};

export const extractPath = (req: NextRequest) => {
  let hostname = req.headers.get("host")!.replace("www.", "");
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${req.nextUrl.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;
  return { hostname, path, searchParams };
};