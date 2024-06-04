import type { DefaultSession } from "next-auth";
import type { PrismaAdapter } from "@auth/prisma-adapter";

import {
  User as PrismaUser,
  Session as PrismaSession,
  Account as PrismaAccount,
  VerificationToken as PrismaVerificationToken,
  AccountType as PrismaAccountType,
  Profile as PrismaProfile,
} from "@prisma/client";

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends PrismaUser {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session extends PrismaSession {}

  interface Account extends PrismaAccount {}

  interface Profile extends PrismaProfile {}
}

declare module "@auth/core/adapters" {
  interface Adapter {}
  interface AdapterAccount extends PrismaAccount {}
  interface AdapterSession extends PrismaSession {}
  interface VerificationToken extends PrismaVerificationToken {}

  interface AdapterUser extends PrismaUser {}
}
