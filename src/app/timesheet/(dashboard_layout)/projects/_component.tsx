import { MainContainer, PageHeader } from "@/components/themes/timesheet";

type TimesheetProjectClientProps = {
  ROOT_DOMAIN: string;
};

export function TimesheetProjectClient(props: TimesheetProjectClientProps) {
  return (
    <MainContainer>
      <PageHeader title="Projects" />
    </MainContainer>
  );
}
