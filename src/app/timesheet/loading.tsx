import Image from "next/image";
import logo from "@/assets/favicons/timesheet.png";
import { Spinner } from "@/components/ui/spinner";
export default function TimesheetLoading() {
  return (
    <div className="min-h-svh flex justify-center items-center gap-10 flex-col">
      <div className="flex items-center gap-5">
        <Image src={logo} alt="Timesheet Logo" width={64} height={64} />
        <div className="space-y-1">
          <h1 className="font-bold text-2xl">Timesheet</h1>
          <p>ladyk.dev</p>
        </div>
      </div>

      <Spinner className="text-primary w-14 h-14" />
    </div>
  );
}
