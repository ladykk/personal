import { notFound } from "next/navigation";
import { TimesheetContactFormClient } from "./_component";
import { env } from "@/env";
import { trpc } from "@/trpc/server";
import { RouterOutputs } from "@/trpc/shared";
import Contact from "@/server/models/timesheet/contact";

type TimesheetContactFormPageProps = {
  params: {
    contact_id: string;
  };
};
export default async function TimesheetContactFormPage(
  props: TimesheetContactFormPageProps
) {
  const contactId =
    props.params.contact_id === "add" ? 0 : Number(props.params.contact_id);

  if (Number.isNaN(contactId)) notFound();

  const initialData: RouterOutputs["timesheet"]["contact"]["getContact"] =
    contactId === 0
      ? Contact.schemas.base.parse({})
      : await trpc.timesheet.contact.getContact.query(contactId);

  return (
    <TimesheetContactFormClient
      ROOT_DOMAIN={env.ROOT_DOMAIN}
      contactId={contactId}
      initialData={initialData}
    />
  );
}
