import "server-only";
import NextAuth from "next-auth";

import authAdapter from "./adapter";
import Github from "next-auth/providers/github";
import { prisma } from "../database";
import google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const SESSION_MAX_AGE = 24 * 60 * 60;

export const providers = [
  Credentials({
    credentials: {
      username: { label: "Username" },
      password: { label: "Password", type: "password" },
    },
    async authorize({ username, password }) {
      if (username === "Nishant" && password === "password") {
        return await prisma.user.findFirst({
          where: { name: "Nishant", password: "password" },
        });
      } else return null;
    },
  }),
  google({}),
  Github({
    authorization: {
      params: {
        scope: "email",
      },
    },
  }),
];

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  debug: true,
  events: {},
  adapter: authAdapter(prisma),
  callbacks: {
    async jwt({ user }) {
      const session = await authAdapter(prisma).createSession?.({
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
      // This is the string returned from the `jwt` callback above.
      // It represents the session token that will be set in the browser.
      return token?.id as unknown as string;
    },
    decode() {
      // Disable default JWT decoding.
      // This method is really only used when using the email provider.
      return null;
    },
  },
  pages: {
    // signIn: "/signIn",
  },
  providers,
  session: {
    strategy: "database",
    maxAge: SESSION_MAX_AGE,
    updateAge: 15 * 60,
    generateSessionToken: () => crypto.randomUUID(),
  },
});
