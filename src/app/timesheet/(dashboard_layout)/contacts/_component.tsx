import { MainContainer, PageHeader } from "@/components/themes/timesheet";
import { buttonVariants } from "@/components/ui/button";
import { getAppUrl } from "@/lib/url";
import { Plus } from "lucide-react";
import Link from "next/link";

type TimesheetContactClientProps = {
  ROOT_DOMAIN: string;
};
export function TimesheetContactClient(props: TimesheetContactClientProps) {
  return (
    <MainContainer>
      <PageHeader
        title="Contacts"
        actions={
          <>
            <Link
              className={buttonVariants({
                size: "icon",
              })}
              href={getAppUrl(props.ROOT_DOMAIN, "timesheet", "/contacts/add")}
            >
              <Plus />
            </Link>
          </>
        }
      />
    </MainContainer>
  );
}
