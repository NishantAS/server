import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import credentials from "next-auth/providers/credentials";
import passkey from "next-auth/providers/passkey";
import twitch from "next-auth/providers/twitch";
import spotify from "next-auth/providers/spotify";
import reddit from "next-auth/providers/reddit";
import linkedin from "next-auth/providers/linkedin";
import facebook from "next-auth/providers/facebook";
import discord from "next-auth/providers/discord";
import gitlab from "next-auth/providers/gitlab";
import { NextAuthConfig } from "next-auth";
import authAdapter from "./adapter";
import { prisma } from "../database";

const SESSION_MAX_AGE =
  (process.env.SESSION_MAX_AGE as number | undefined) ?? 24 * 60 * 60;

export const providers = [
  credentials({
    credentials: {
      username: { label: "Username" },
      password: { label: "Password", type: "password" },
    },
    async authorize({ username, password }) {
      if (username === "Nishant" && password === "password") {
        return await prisma.user.findFirst({
          where: { id: "0" },
        });
      } else return null;
    },
  }),
  github({
    checks: ["state", "nonce", "pkce"],
    authorization: {
      params: {
        prompt: "select_account",
      },
    },
  }),
  google({
    checks: ["nonce", "state", "pkce"],
  }),
  twitch({
    checks: ["state", "nonce", "pkce"],
  }),
  spotify({
    checks: ["state", "nonce", "pkce"],
  }),
  reddit({
    checks: ["state", "nonce", "pkce"],
  }),
  linkedin({
    checks: ["state", "nonce", "pkce"],
  }),
  facebook({
    checks: ["state", "nonce", "pkce"],
  }),
  discord({
    checks: ["state", "nonce", "pkce"],
  }),
  gitlab({
    checks: ["state", "nonce", "pkce"],
  }),
  passkey({
    registrationOptions: {
      authenticatorSelection: {
        userVerification: "required",
        authenticatorAttachment: "platform",
      },
    },
  }),
];

export const config: NextAuthConfig = {
  experimental: {
    enableWebAuthn: true,
  },
  cookies: {
    sessionToken: {
      name: "gpa-app.session",
    },
    callbackUrl: {
      name: "gpa-app.callbackUrl",
    },
    csrfToken: {
      name: "gpa-app.csrf",
    },
    nonce: {
      name: "gpa-app.authjs.nonce",
    },
    pkceCodeVerifier: {
      name: "gpa-app.authjs.pkce",
    },
    state: {
      name: "gpa-app.authjs.state",
    },
    webauthnChallenge: {
      name: "gpa-app.authjs.webauthn.challenge",
    },
  },
  debug: process.env.NODE_ENV !== "production",
  events: {},
  adapter: authAdapter(prisma),
  callbacks: {
    async jwt({ user, session }) {
      session ??= await authAdapter(prisma).createSession?.({
        sessionToken: crypto.randomUUID(),
        userId: user.id!,
        expires: new Date(Date.now() + SESSION_MAX_AGE * 1000),
      });
      return { id: session?.sessionToken };
    },
    session({ session: defaultSession, user }) {
      return {
        sessionToken: defaultSession.sessionToken,
        expires: defaultSession.expires,
        userId: user.id,
      };
    },
    authorized({ auth }) {
      return !!auth;
    },
  },
  jwt: {
    encode({ token }) {
      return token?.id as unknown as string;
    },
    decode() {
      return null;
    },
  },
  providers,
  session: {
    strategy: "database",
    maxAge: SESSION_MAX_AGE,
    updateAge: 15 * 60,
    generateSessionToken: () => crypto.randomUUID(),
  },
};
