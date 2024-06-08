export { auth as default } from "@/lib/services/auth";
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|\.well-known/assetlinks.json).*)"],
};

export const runtime = "experimental-edge";
