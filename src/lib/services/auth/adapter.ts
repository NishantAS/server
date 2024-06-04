import "server-only";
import type { Adapter } from "@auth/core/adapters";
import { PrismaClient } from "@prisma/client";
import { AdapterAccount } from "next-auth/adapters";

export default function PostgresAdapter(client: PrismaClient): Adapter {
  return {
    createUser: (user) =>
      client.user.create({
        data: user,
      }),
    getUser: (id) => client.user.findUnique({ where: { id } }),
    getUserByEmail: (email) => client.user.findUnique({ where: { email } }),
    getUserByAccount: async ({ providerAccountId, provider }) =>
      (
        await client.account.findUnique({
          where: {
            provider_providerAccountId: { providerAccountId, provider },
          },
          include: { user: true },
        })
      )?.user ?? null,
    updateUser: ({ id, ...user }) =>
      client.user.update({
        data: user,
        where: { id },
      }),
    deleteUser: async (userId) =>
      await client.user.delete({ where: { id: userId } }),
    linkAccount: async (account) =>
      (await client.account.create({ data: account })) as unknown as
        | AdapterAccount
        | undefined,
    unlinkAccount: async ({ providerAccountId, provider }) =>
      (await client.account.delete({
        where: { provider_providerAccountId: { provider, providerAccountId } },
      })) as unknown as AdapterAccount | undefined,
    createSession: async (session) =>
      await client.session.create({ data: session }),
    async getSessionAndUser(sessionToken) {
      const sessionWithUser = await client.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (sessionWithUser) {
        const { user, ...session } = sessionWithUser;
        return {
          user,
          session,
        };
      } else return null;
    },
    updateSession: async ({ sessionToken, expires, userId }) =>
      await client.session.update({
        where: { sessionToken },
        data: { expires, userId },
      }),
    deleteSession: async (sessionToken) =>
      await client.session.delete({ where: { sessionToken } }),
    // async createVerificationToken({ identifier, expires, token }) {
    //   return;
    // },
    // async useVerificationToken({ identifier, token }) {
    //   return;
    // },
    getAccount: async (providerAccountId, provider) =>
      (await client.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
      })) as AdapterAccount | null,

    getAuthenticator: (credentialID) =>
      client.authenticator.findFirst({ where: { credentialID } }),

    createAuthenticator: (auth) => client.authenticator.create({ data: auth }),
    listAuthenticatorsByUserId: (userId) =>
      client.authenticator.findMany({ where: { userId } }),
    updateAuthenticatorCounter: (credentialID, counter) =>
      client.authenticator.update({
        where: { credentialID },
        data: { counter },
      }),
  };
}
