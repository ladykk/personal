"use client";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SitePage() {
  const { data: session } = useSession();
  return (
    <div className="min-h-svh flex flex-col items-center justify-center">
      {session ? (
        <>
          <p>Welcome, {session.user.name ?? session.user.email}!</p>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </>
      ) : (
        <>
          <Button onClick={() => signIn()}>Sign In</Button>
        </>
      )}
    </div>
  );
}
