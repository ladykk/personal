"use client";
import { MainContainer, PageHeader } from "@/components/themes/timesheet";
import { buttonVariants } from "@/components/ui/button";
import { getAppUrl } from "@/lib/url";
import { Plus } from "lucide-react";
import Link from "next/link";

type TimesheetProjectClientProps = {
  ROOT_DOMAIN: string;
};

export function TimesheetProjectClient(props: TimesheetProjectClientProps) {
  return (
    <MainContainer>
      <PageHeader
        title="Projects"
        actions={
          <Link
            href={getAppUrl(props.ROOT_DOMAIN, "timesheet", "/projects/add")}
            className={buttonVariants({
              size: "icon",
            })}
          >
            <Plus />
          </Link>
        }
      />
    </MainContainer>
  );
}
