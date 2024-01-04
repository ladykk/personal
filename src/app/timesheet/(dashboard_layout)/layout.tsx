import { Navbar, SidebarWrapper } from "@/components/themes/timesheet";
import { env } from "@/env";

type TimesheetDashboardLayoutProps = {
  children: React.ReactNode;
};
export default function TimesheetDashboardLayout(
  props: TimesheetDashboardLayoutProps
) {
  return (
    <div className="min-h-svh flex flex-col">
      <Navbar ROOT_DOMAIN={env.ROOT_DOMAIN} />
      <SidebarWrapper>{props.children}</SidebarWrapper>
    </div>
  );
}
