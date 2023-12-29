import { db } from "@/db";
import { env } from "@/env";
import { AuthOptions } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import LineProvider from "next-auth/providers/line";
import type { Adapter } from "next-auth/adapters";
import { getAppUrl, handleRedirect } from "@/lib/url";

const useSecureCookies = env.NEXTAUTH_URL.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = new URL(env.NEXTAUTH_URL).hostname;
const RootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN;

export const authOptions: AuthOptions = {
  providers: [
    LineProvider({
      clientId: env.LINE_CLIENT_ID,
      clientSecret: env.LINE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: getAppUrl(RootDomain, "auth", "/signin"),
    signOut: getAppUrl(RootDomain, "auth", "/signout"),
    error: getAppUrl(RootDomain, "auth", "/error"),
    verifyRequest: getAppUrl(RootDomain, "auth", "/verify-request"),
    newUser: getAppUrl(RootDomain, "auth", "/new-user"),
  },
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
    redirect: ({ url, baseUrl }) => handleRedirect(RootDomain, url, baseUrl),
  },
  session: {
    strategy: "database",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: DrizzleAdapter(db) as Adapter,
  useSecureCookies: useSecureCookies,
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: hostName == "localhost" ? hostName : "." + RootDomain,
      },
    },
  },
};
