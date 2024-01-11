import Project from "@/server/models/timesheet/project";
import { trpc } from "@/trpc/server";
import { RouterOutputs } from "@/trpc/shared";
import { notFound } from "next/navigation";
import TimesheetProjectFormClient from "./_component";
import { env } from "@/env";

type TimesheetProjectFormPageProps = {
  params: {
    project_id: string;
  };
};
export default async function TimesheetProjectFormPage(
  props: TimesheetProjectFormPageProps
) {
  const projectId =
    props.params.project_id === "add" ? 0 : Number(props.params.project_id);

  if (Number.isNaN(projectId)) notFound();

  const initialData: RouterOutputs["timesheet"]["project"]["getProject"] =
    projectId === 0
      ? Project.schemas.base.parse({})
      : await trpc.timesheet.project.getProject.query(projectId);
  const contacts = await trpc.timesheet.contact.getContacts.query({});

  return (
    <TimesheetProjectFormClient
      ROOT_DOMAIN={env.ROOT_DOMAIN}
      projectId={projectId}
      initialData={initialData}
      contactsInitialData={contacts}
    />
  );
}
