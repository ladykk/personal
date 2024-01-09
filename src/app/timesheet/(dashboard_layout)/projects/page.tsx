import { env } from "@/env";
import { TimesheetProjectClient } from "./_component";

type Props = {};

export default async function TimesheetProjectPage(props: Props) {
  return <TimesheetProjectClient ROOT_DOMAIN={env.ROOT_DOMAIN} />;
}
