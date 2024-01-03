export type Application = "site" | "auth" | "timesheet" | "storage";

export type TSubDomainMappings = {
  [key in Application]: {
    subDomain: string;
    basePath: string;
  };
};
export const SubDomainMappings: TSubDomainMappings = {
  site: {
    subDomain: "",
    basePath: "site",
  },
  auth: {
    subDomain: "auth",
    basePath: "auth",
  },
  timesheet: {
    subDomain: "timesheet",
    basePath: "timesheet",
  },
  storage: {
    subDomain: "storage",
    basePath: "storage/file",
  },
} as const;
