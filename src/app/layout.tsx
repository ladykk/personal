import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/common/provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/services/auth";
import { env } from "@/env";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "ladyk.dev",
  description:
    "A monorepos project to prove the concept of reusability, scalability, and development experience.",
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
        <Providers
          cookies={cookies()}
          session={session}
          authBasePath={env.NEXTAUTH_URL}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
