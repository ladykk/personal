import { notFound } from "next/navigation";
import { TimesheetContactFormClient } from "./_component";

type TimesheetContactFormPageProps = {
  params: {
    contact_id: string;
  };
};
export default function TimesheetContactFormPage(
  props: TimesheetContactFormPageProps
) {
  const contact_id =
    props.params.contact_id === "add" ? 0 : Number(props.params.contact_id);

  if (Number.isNaN(contact_id)) notFound();

  return <TimesheetContactFormClient />;
}
