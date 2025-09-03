"use server";

import { type NextRequest, NextResponse } from "next/server";

import { ADMIN_PAGES } from "@/config/pages/admin.config";
import { PARTNER_PAGES } from "@/config/pages/partner.config";
import { getTokensFromRequest } from "./utils/get-tokens-from-request";
import { jwtVerifyServer } from "./utils/jwt-verify";
import { nextRedirect } from "./utils/next-redirect";
import { UserRole } from "@/shared/types/auth.types";

export async function protectLoginPages(
  request: NextRequest
): Promise<NextResponse> {
  const tokens = await getTokensFromRequest(request);
  if (!tokens) return NextResponse.next();

  const verifiedData = await jwtVerifyServer(tokens.access_token);
  if (!verifiedData) return NextResponse.next();

  if (verifiedData.aud === UserRole.ADMIN) {
    return nextRedirect(ADMIN_PAGES.HOME, request.url);
  } else if (verifiedData.aud === UserRole.PARTNER) {
    return nextRedirect(PARTNER_PAGES.HOME, request.url);
  }

  return NextResponse.next();
}
