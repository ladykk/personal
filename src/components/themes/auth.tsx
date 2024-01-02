import { cn } from "@/lib/utils";

type AuthContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const AuthContainer = (props: AuthContainerProps) => {
  return (
    <div
      className={cn(
        "p-5 border w-full rounded-lg shadow bg-card m-5",
        props.className
      )}
    >
      {props.children}
    </div>
  );
};
