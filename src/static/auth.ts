import { BuiltInProviderType } from "next-auth/providers/index";
import { LiteralUnion } from "next-auth/react";
import lineLogo from "@/assets/oauth/line.svg";

type AuthPage = "signin" | "signout" | "error" | "verify-request" | "new-user";
export const getAuthPage = (
  url: string,
  page: AuthPage,
  callbackUrl?: string
) => `${url}/auth/${page}${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`;

// Auth Sign In Error
export type AuthSignInErrorCode =
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"
  | "Default";

type SignInError = {
  [key in AuthSignInErrorCode]: {
    code: key;
    message: string;
  };
};

export const SignInError: SignInError = {
  OAuthSignin: {
    code: "OAuthSignin",
    message: "Error in constructing an authorization URL.",
  },
  OAuthCallback: {
    code: "OAuthCallback",
    message: "Error in handling the response from an OAuth provider.",
  },
  OAuthCreateAccount: {
    code: "OAuthCreateAccount",
    message: "Could not create OAuth provider user in the database.",
  },
  EmailCreateAccount: {
    code: "EmailCreateAccount",
    message: "Could not create email provider user in the database.",
  },
  Callback: {
    code: "Callback",
    message: "Error in the OAuth callback handler route.",
  },
  OAuthAccountNotLinked: {
    code: "OAuthAccountNotLinked",
    message:
      "This email address is already associated with an account, please sign in with the correct provider.",
  },
  EmailSignin: {
    code: "EmailSignin",
    message:
      "Failed to send the verification token to your email, please try again.",
  },
  CredentialsSignin: {
    code: "CredentialsSignin",
    message:
      "Username and password combination not found, please check you have entered your details correctly.",
  },
  SessionRequired: {
    code: "SessionRequired",
    message: "Please sign in to continue.",
  },
  Default: {
    code: "Default",
    message: "Something went wrong. Please try again later.",
  },
};

// Auth Error
export type AuthErrorCode =
  | "Configuration"
  | "AccessDenied"
  | "Verification"
  | "Default";

type AuthError = {
  [key in AuthErrorCode]: {
    code: key;
    message: string;
  };
};

export const AuthError: AuthError = {
  Configuration: {
    code: "Configuration",
    message:
      "The authentication configuration is incorrect, please check the environment variables.",
  },
  AccessDenied: {
    code: "AccessDenied",
    message:
      "You do not have permission to access this resource, please contact the administrator.",
  },
  Verification: {
    code: "Verification",
    message:
      "The verification token is invalid or has expired, please try again.",
  },
  Default: {
    code: "Default",
    message: "Something went wrong, please try again later.",
  },
};

type OAuthTheme = {
  [key in LiteralUnion<BuiltInProviderType>]:
    | {
        logo: string;
        colorCode: string;
      }
    | undefined;
};

export const OAuthTheme: OAuthTheme = {
  line: {
    logo: lineLogo,
    colorCode: "#00B900",
  },
  email: undefined,
  oauth: undefined,
  credentials: undefined,
  "42-school": undefined,
  apple: undefined,
  atlassian: undefined,
  auth0: undefined,
  authentik: undefined,
  "azure-ad-b2c": undefined,
  "azure-ad": undefined,
  battlenet: undefined,
  box: undefined,
  "boxyhq-saml": undefined,
  bungie: undefined,
  cognito: undefined,
  coinbase: undefined,
  discord: undefined,
  dropbox: undefined,
  "duende-identity-server6": undefined,
  eveonline: undefined,
  facebook: undefined,
  faceit: undefined,
  foursquare: undefined,
  freshbooks: undefined,
  fusionauth: undefined,
  github: undefined,
  gitlab: undefined,
  google: undefined,
  hubspot: undefined,
  "identity-server4": undefined,
  index: undefined,
  instagram: undefined,
  kakao: undefined,
  keycloak: undefined,
  linkedin: undefined,
  mailchimp: undefined,
  mailru: undefined,
  medium: undefined,
  naver: undefined,
  netlify: undefined,
  "oauth-types": undefined,
  okta: undefined,
  onelogin: undefined,
  osso: undefined,
  osu: undefined,
  passage: undefined,
  patreon: undefined,
  pinterest: undefined,
  pipedrive: undefined,
  reddit: undefined,
  salesforce: undefined,
  slack: undefined,
  spotify: undefined,
  strava: undefined,
  todoist: undefined,
  trakt: undefined,
  twitch: undefined,
  twitter: undefined,
  "united-effects": undefined,
  vk: undefined,
  wikimedia: undefined,
  wordpress: undefined,
  workos: undefined,
  yandex: undefined,
  zitadel: undefined,
  zoho: undefined,
  zoom: undefined,
};
