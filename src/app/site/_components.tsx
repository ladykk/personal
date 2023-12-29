"use client";
import { AuthSection } from "@/components/common/auth";
import { ThemeToggle } from "@/components/themes";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Contacts } from "@/static/site";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Element, Link as ScrollLink } from "react-scroll";

// Screen Container
type ScreenContainerProps = {
  children: React.ReactNode;
  name: string;
  className?: string;
};
export const ScreenContainer = (props: ScreenContainerProps) => (
  <Element
    name={props.name}
    className={cn(
      "min-h-svh pt-[65px] pb-[80px] border-b last:border-b-0",
      props.className
    )}
  >
    {props.children}
  </Element>
);

// Bottombar
export const Bottombar = () => (
  <div className="bg-background min-h-[80px] border-t fixed left-0 right-0 bottom-0 p-3 flex items-center z-30">
    <div className="max-w-7xl mx-auto flex items-center justify-between h-fit w-full gap-5">
      <p className="font-medium truncate ...">
        Develop by Mr.Rattapon Apiratjit
      </p>
      <div className="flex gap-3">
        {Contacts.map((contact) => (
          <Link
            key={contact.href}
            href={contact.href}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "px-2 w-10 md:px-4 md:w-auto"
            )}
            target="_blank"
          >
            <contact.icon className="md:mr-2 w-5 h-5 p-0.5" />
            <span className="hidden md:inline-block">{contact.label}</span>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

// Nav Scroll Links
type NavScrollLinksProps = {
  navs: TopbarProps["navs"];
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  className?: (isActive: boolean) => string;
  children: (nav: TopbarProps["navs"][0], isActive: boolean) => ReactNode;
};
const NavScrollLinks = (props: NavScrollLinksProps) => {
  return props.navs.map((nav, index) => (
    <ScrollLink
      key={nav.name}
      to={nav.name}
      spy
      smooth
      duration={500}
      className={props.className?.(props.currentIndex === index) ?? ""}
      onSetActive={() => props.setCurrentIndex(index)}
    >
      {props.children(nav, props.currentIndex === index)}
    </ScrollLink>
  ));
};

// Topbar
type TopbarProps = {
  navs: Array<{
    name: string;
    label: string;
  }>;
  ROOT_DOMAIN: string;
};
export const Topbar = (props: TopbarProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div
      className={cn(
        "p-3 fixed left-0 right-0 top-0 flex justify-between items-center z-30 min-h-[60px] transition-all duration-75",
        currentIndex > 0 && "bg-background border-b"
      )}
    >
      <div className="sm:flex items-center hidden">
        <NavScrollLinks
          navs={props.navs}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          className={(isActive) =>
            cn(
              buttonVariants({ variant: "link" }),
              "hover:cursor-pointer",
              isActive && "underline"
            )
          }
        >
          {(nav) => nav.label}
        </NavScrollLinks>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" className="underline sm:hidden">
            {props.navs[currentIndex].label}
            <ChevronDown className="ml-1.5 p-0.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <NavScrollLinks
            navs={props.navs}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          >
            {(nav) => <DropdownMenuItem>{nav.label}</DropdownMenuItem>}
          </NavScrollLinks>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-2.5">
        <AuthSection ROOT_DOMAIN={props.ROOT_DOMAIN} />
        <ThemeToggle />
      </div>
    </div>
  );
};
