export type Application = "site" | "auth" | "timesheet";

export type TSubDomainMappings = { [key in Application]: string };
export const SubDomainMappings: TSubDomainMappings = {
  site: "",
  auth: "auth",
  timesheet: "timesheet",
} as const;
