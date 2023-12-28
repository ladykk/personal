import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { cookies } from "next/headers";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "ladyk.dev",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-svh bg-muted font-sans antialiased">
        <Providers session={session} authBasePath={env.NEXTAUTH_URL}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
