import "server-only";
import Auth from "next-auth";
import { config } from "./config";
import { NextRequest } from "next/server";
import { Session } from "next-auth";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = Auth(config);

export const authenticated: (
  callback: (
    req: AuthenticatedRequest,
    ctx: any
  ) => Promise<Response> | Response
) => (
  req: NextRequest,
  ctx: any
) => Promise<Response | void> | Response | void = (callback) =>
  auth(async (req, ctx) => {
    const newReq = req as NextRequest;
    if (!req.auth) return await signIn();
    else return await callback(req as AuthenticatedRequest, ctx);
  });

interface AuthenticatedRequest extends NextRequest {
  auth: Session;
}
