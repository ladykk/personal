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
    ? `http://${ROOT_DOMAIN}/${app}${path}${searchParams?.toString()}`
    : `https://${
        SubDomainMappings[app].length > 0 ? `${SubDomainMappings[app]}.` : ""
      }${ROOT_DOMAIN}${path}${searchParams.toString()}`;
};

export const isSubDomain = (
  ROOT_DOMAIN: string,
  hostName: string,
  application: Application
) =>
  hostName ===
  `${
    SubDomainMappings[application].length > 0
      ? `${SubDomainMappings[application]}.`
      : ""
  }${ROOT_DOMAIN}`;

export const extractPath = (ROOT_DOMAIN: string, req: NextRequest) => {
  let hostname = req.headers.get("host")!.replace("www.", "");
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${req.nextUrl.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;
  return { hostname, path, searchParams };
};

export const handleRedirect = (
  ROOT_DOMAIN: string,
  url: string,
  baseUrl: string
) => {
  const hostname = new URL(baseUrl).hostname.replace("www.", "");
  // If callbackUrl is not the same domain as the site, redirect to baseUrl
  if (!hostname.endsWith(ROOT_DOMAIN)) return baseUrl;

  // If callbackUrl subdomain is not in the list of valid applications, redirect to baseUrl
  const subdomain = hostname
    .replace(ROOT_DOMAIN, "")
    .replace(".", "") as Application;
  if (!Object.values(SubDomainMappings).includes(subdomain)) return baseUrl;

  // Otherwise redirect to url
  return url;
};
