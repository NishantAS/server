import { auth, signIn } from "@/lib/services/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) await signIn();
  return <div>{children}</div>;
}
