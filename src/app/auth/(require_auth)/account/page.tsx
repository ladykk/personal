import { Metadata } from "next";
import AuthAccountClient from "./_client";
import { trpc } from "@/trpc/server";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "Manage Account | ladyk.dev",
};

export default async function AuthAccountPage() {
  const profile = await trpc.auth.profile.getProfile.query(undefined);
  return <AuthAccountClient profile={profile} ROOT_DOMAIN={env.ROOT_DOMAIN} />;
}
