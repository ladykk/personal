"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
      {session ? (
        <>
          Sign in as {session.user?.name}
          <br />
          <Button onClick={() => signOut()}>Sign Out</Button>
        </>
      ) : (
        <>
          Not signed in
          <br />
          <Button onClick={() => signIn()}>Sign In</Button>
        </>
      )}
    </div>
  );
}
