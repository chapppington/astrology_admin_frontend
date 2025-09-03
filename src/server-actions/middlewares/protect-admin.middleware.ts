"use server";

import { type NextRequest, NextResponse } from "next/server";

import { UserRole } from "@/shared/types/auth.types";
import { getTokensFromRequest } from "./utils/get-tokens-from-request";
import { jwtVerifyServer } from "./utils/jwt-verify";
import { redirectToLoginOrNotFound } from "./utils/redirect-to-login-or-404";

export async function protectAdminPages(
  request: NextRequest
): Promise<NextResponse> {
  const tokens = await getTokensFromRequest(request);
  if (!tokens) return redirectToLoginOrNotFound(request);

  const verifiedData = await jwtVerifyServer(tokens.access_token);
  if (!verifiedData) return redirectToLoginOrNotFound(request);

  if (verifiedData.aud !== UserRole.ADMIN) {
    return redirectToLoginOrNotFound(request);
  }

  return NextResponse.next();
}
