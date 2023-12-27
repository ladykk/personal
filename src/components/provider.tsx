"use client";
import { trpc } from "@/lib/trpc/client";
import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { Toaster } from "./ui/sonner";

type Props = {
  children: React.ReactNode;
  session: Session | undefined | null;
};

export default function Providers(props: Props) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/api/trpc",
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <SessionProvider session={props.session}>
        {props.children}
        <Toaster />
      </SessionProvider>
    </trpc.Provider>
  );
}
