import { BackLink, HomePageLink } from "@/components/common/links";
import { ThemeToggle } from "@/components/themes";
import { FileWarning } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {};

export default function NotFoundPage() {
  return (
    <div className="min-h-svh w-screen grid grid-rows-[auto_1fr_auto]">
      <div className="flex-1 flex justify-between items-center w-full p-3">
        <BackLink />
        <ThemeToggle />
      </div>
      <div className="flex justify-center items-center flex-col">
        <FileWarning className="w-20 h-20 mb-5" />
        <p className="text-2xl font-bold mb-1.5">404 | Page Not Found</p>
        <p className="text-muted-foreground mb-5">
          Could not find the page that you requested.
        </p>
        <HomePageLink />
      </div>
      <div className="p-5">
        <p className="flex items-center justify-center text-muted-foreground font-semibold text-sm">
          ladyk.dev
        </p>
      </div>
    </div>
  );
}
