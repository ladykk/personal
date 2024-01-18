import { env } from "@/env";
import { TimesheetProjectClient } from "./_component";
import { trpc } from "@/trpc/server";
import { RouterInputs } from "@/trpc/shared";

type Props = {
  searchParams: RouterInputs["timesheet"]["project"]["getPaginateProjects"];
};

export default async function TimesheetProjectPage(props: Props) {
  const initialData = await trpc.timesheet.project.getPaginateProjects.query(
    props.searchParams
  );
  return (
    <TimesheetProjectClient
      ROOT_DOMAIN={env.ROOT_DOMAIN}
      initialInput={props.searchParams}
      initialData={initialData}
    />
  );
}
