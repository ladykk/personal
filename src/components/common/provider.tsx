"use client";
import { TRPCReactProvider } from "@/trpc/client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "../ui/sonner";
import { ThemeProvider } from "../themes";
import { type cookies } from "next/headers";

type Props = {
  children: React.ReactNode;
  session: Session | undefined | null;
  authBasePath: string;
  cookies: ReturnType<typeof cookies>;
};

export default function Providers(props: Props) {
  return (
    <TRPCReactProvider cookies={props.cookies.toString()}>
      <SessionProvider session={props.session}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {props.children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </SessionProvider>
    </TRPCReactProvider>
  );
}
