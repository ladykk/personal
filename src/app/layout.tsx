import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

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
      <body className="min-h-svh bg-background font-sans antialiased">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
