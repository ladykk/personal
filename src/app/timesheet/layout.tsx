import { Metadata } from "next";
import favicon from "@/assets/favicons/timesheet.png";
import RequireAuthLayout from "../auth/(require_auth)/layout";
import { Navbar, SidebarWrapper } from "@/components/themes/timesheet";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "Timesheet | ladyk.dev",
  description: "An application to track time spent on projects.",
  icons: {
    icon: favicon.src,
  },
};

export default async function TimesheetLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuthLayout>
      <div className="min-h-svh flex flex-col">
        <Navbar ROOT_DOMAIN={env.ROOT_DOMAIN} />
        <SidebarWrapper>{props.children}</SidebarWrapper>
      </div>
    </RequireAuthLayout>
  );
}
