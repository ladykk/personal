import { ModeToggle } from "@/components/themes/mode";
import { BackLink } from "./client";

type Props = {
  children: React.ReactNode;
};

export default function AuthTemplate(props: Props) {
  return (
    <div className="min-h-svh w-screen grid grid-rows-[4rem_1fr_3rem]">
      <div className="flex-1 flex justify-between items-center w-full p-3">
        <BackLink />
        <ModeToggle />
      </div>
      <div className="flex justify-center items-center">{props.children}</div>
      <div>
        <p className="flex items-center justify-center text-muted-foreground font-semibold text-sm">
          Authentication | ladyk.dev
        </p>
      </div>
    </div>
  );
}
