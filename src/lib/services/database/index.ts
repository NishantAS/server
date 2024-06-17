import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prisma: any;
}

export const prisma =
  globalThis.prisma ?? new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
