import { ModeToggle } from "@/components/themes/mode";
import { BackLink } from "@/components/common/links";

type Props = {
  children: React.ReactNode;
};

export default function AuthTemplate(props: Props) {
  return (
    <div className="min-h-svh w-screen grid grid-rows-[auto_1fr_auto]">
      <div className="flex-1 flex justify-between items-center w-full p-3">
        <BackLink />
        <ModeToggle />
      </div>
      <div className="flex justify-center items-center">{props.children}</div>
      <div className="p-5">
        <p className="flex items-center justify-center text-muted-foreground font-semibold text-sm">
          Authentication | ladyk.dev
        </p>
      </div>
    </div>
  );
}
