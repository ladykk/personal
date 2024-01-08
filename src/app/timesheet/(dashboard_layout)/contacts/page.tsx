import { env } from "@/env";
import { TimesheetContactClient } from "./_component";
import { trpc } from "@/trpc/server";
import { RouterInputs } from "@/trpc/shared";

type Props = {
  searchParams: RouterInputs["timesheet"]["contact"]["getPaginateContacts"];
};
export default async function TimesheetContactPage(props: Props) {
  const initialData = await trpc.timesheet.contact.getPaginateContacts.query(
    props.searchParams
  );
  return (
    <TimesheetContactClient
      ROOT_DOMAIN={env.ROOT_DOMAIN}
      initialInput={props.searchParams}
      initialData={initialData}
    />
  );
}
