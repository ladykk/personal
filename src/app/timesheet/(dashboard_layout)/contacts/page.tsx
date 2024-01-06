import { env } from "@/env";
import { TimesheetContactClient } from "./_component";

export default function TimesheetContactPage() {
  return <TimesheetContactClient ROOT_DOMAIN={env.ROOT_DOMAIN} />;
}
