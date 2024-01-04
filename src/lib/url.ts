import { Application, SubDomainMappings } from "@/static/app";

export const getAppUrl = (
  ROOT_DOMAIN: string,
  app: Application,
  path: string,
  searchParams: URLSearchParams = new URLSearchParams()
) => {
  const isDev = ROOT_DOMAIN.startsWith("localhost");
  const searchParamsString = searchParams.toString();
  return isDev
    ? `http://${ROOT_DOMAIN}/${SubDomainMappings[app].basePath}${path}${
        searchParamsString.length > 0 ? `?${searchParamsString}` : ""
      }`
    : `https://${
        SubDomainMappings[app].subDomain.length > 0
          ? `${SubDomainMappings[app].subDomain}.`
          : ""
      }${ROOT_DOMAIN}/${path}${
        searchParamsString.length > 0 ? `?${searchParamsString}` : ""
      }`;
};
