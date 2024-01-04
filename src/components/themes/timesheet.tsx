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
import { Menu, X } from "lucide-react";
import { JSX, ClassAttributes, HTMLAttributes } from "react";

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
};
export function SidebarWrapper(props: SidebarWrapperProps) {
  const isOpen = useSidebarStore((state) => state.isOpen);
  return (
    <div className="flex-1 flex relative pt-[3.5rem]">
      <div
        className={cn(
          "w-full max-w-[300px] fixed top-0 left-0 bottom-0 bg-background border-r transition-transform xl:translate-x-0",
          !isOpen && "-translate-x-[301px]"
        )}
      ></div>
      <div
        className={cn(
          "w-screen transition-transform xl:ml-[300px] xl:translate-x-0",
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
