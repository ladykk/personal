"use client";
import logo from "@/assets/favicons/timesheet.png";
import { ThemeToggle } from ".";
import { AuthSection } from "../common/auth";
import { Button, buttonVariants } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAppUrl } from "@/lib/url";
import { create } from "zustand";
import { BookUser, LucideIcon, Menu, X } from "lucide-react";
import { JSX, ClassAttributes, HTMLAttributes } from "react";
import { usePathname } from "next/navigation";
import { BackButton } from "../common/links";

type NavbarProps = {
  ROOT_DOMAIN: string;
};
export function Navbar(props: NavbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-background h-14 z-50 flex items-center justify-between px-2 border-b">
      <div className="flex items-center gap-2">
        <SidebarControl />
        <Link
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "gap-2 px-2 hidden xl:inline-flex"
          )}
          href={getAppUrl(props.ROOT_DOMAIN, "timesheet", "/")}
        >
          <Image src={logo} alt="Timesheet Logo" width={24} height={24} />
          Timesheet
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <AuthSection ROOT_DOMAIN={props.ROOT_DOMAIN} />
        <ThemeToggle />
      </div>
    </div>
  );
}

interface SidebarStore {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}
export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));

export function SidebarControl() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const toggle = useSidebarStore((state) => state.toggle);
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={toggle}
      className="xl:hidden"
    >
      <div
        className={cn(
          isOpen ? "rotate-90" : "rotate-0",
          "transition-transform"
        )}
      >
        {isOpen ? <X /> : <Menu />}
      </div>
    </Button>
  );
}

type SidebarWrapperProps = {
  children: React.ReactNode;
  ROOT_DOMAIN: string;
};
type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};
const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Contacts",
    href: "contacts",
    icon: BookUser,
  },
] as const;
export function SidebarWrapper(props: SidebarWrapperProps) {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const pathname = usePathname().replace("/timesheet", "");
  return (
    <div className="flex-1 flex relative pt-[3.5rem] overflow-x-clip">
      <div
        className={cn(
          "w-full max-w-[300px] fixed top-[3.5rem] left-0 bottom-0 bg-background border-r transition-transform xl:translate-x-0 z-40 p-3",
          !isOpen && "-translate-x-[301px]"
        )}
      >
        {SIDEBAR_ITEMS.map((item) => (
          <Link
            key={item.href}
            className={cn(
              buttonVariants({
                variant: pathname.startsWith(`/${item.href}`)
                  ? "secondary"
                  : "ghost",
              }),
              "w-full justify-start gap-2 px-2"
            )}
            href={getAppUrl(props.ROOT_DOMAIN, "timesheet", `/${item.href}`)}
          >
            {<item.icon />}
            {item.label}
          </Link>
        ))}
      </div>
      <div
        className={cn(
          "w-screen transition-transform xl:pl-[300px] xl:translate-x-0",
          isOpen && "translate-x-[300px]"
        )}
      >
        {props.children}
      </div>
    </div>
  );
}

export function MainContainer(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLDivElement> &
    HTMLAttributes<HTMLDivElement>
) {
  return (
    <div {...props} className={cn("p-3", props.className)}>
      {props.children}
    </div>
  );
}

export function PageHeader(props: {
  title: string;
  backButton?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      {props.backButton && <BackButton />}
      <h1 className="text-3xl font-semibold py-3">{props.title}</h1>
      <div className="flex-1" />
      {props.actions}
    </div>
  );
}

export function FormContainer(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLDivElement> &
    HTMLAttributes<HTMLDivElement>
) {
  return (
    <div
      {...props}
      className={cn("p-5 bg-background rounded-md border", props.className)}
    >
      {props.children}
    </div>
  );
}
