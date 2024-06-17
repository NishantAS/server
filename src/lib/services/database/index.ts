import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ??
  (new PrismaClient().$extends(withAccelerate()) as unknown as PrismaClient);

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
