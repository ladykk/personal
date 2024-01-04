import { Metadata } from "next";
import favicon from "@/assets/favicons/timesheet.png";
import RequireAuthLayout from "../auth/(require_auth)/layout";

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
  return <RequireAuthLayout>{props.children}</RequireAuthLayout>;
}
