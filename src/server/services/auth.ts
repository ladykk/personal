import { db } from "@/server/db";
import { env } from "@/env";
import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import LineProvider from "next-auth/providers/line";
import type { Adapter } from "next-auth/adapters";
import { getAppUrl } from "@/lib/url";
import { Application, SubDomainMappings } from "@/static/app";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const useSecureCookies = env.NEXTAUTH_URL.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = new URL(env.NEXTAUTH_URL).hostname;

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    redirect: ({ url, baseUrl }) => {
      const hostname = new URL(baseUrl).hostname.replace("www.", "");
      // If callbackUrl is not the same domain as the site, redirect to baseUrl
      if (!hostname.endsWith(env.ROOT_DOMAIN)) return baseUrl;

      // If callbackUrl subdomain is not in the list of valid applications, redirect to baseUrl
      const subdomain = hostname
        .replace(env.ROOT_DOMAIN, "")
        .replace(".", "") as Application;
      if (
        !Object.values(SubDomainMappings)
          .map((item) => item.subDomain)
          .includes(subdomain)
      )
        return baseUrl;

      // Otherwise redirect to url
      return url;
    },
  },
  pages: {
    signIn: getAppUrl(env.ROOT_DOMAIN, "auth", "/signin"),
    signOut: getAppUrl(env.ROOT_DOMAIN, "auth", "/signout"),
    error: getAppUrl(env.ROOT_DOMAIN, "auth", "/error"),
    verifyRequest: getAppUrl(env.ROOT_DOMAIN, "auth", "/verify-request"),
    newUser: getAppUrl(env.ROOT_DOMAIN, "auth", "/new-user"),
  },
  session: {
    strategy: "database",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    LineProvider({
      clientId: env.LINE_CLIENT_ID,
      clientSecret: env.LINE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  useSecureCookies: useSecureCookies,
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: hostName === "localhost" ? hostName : "." + env.ROOT_DOMAIN,
      },
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
