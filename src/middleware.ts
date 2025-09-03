import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PAGES } from "@/config/pages/admin.config";
import { PARTNER_PAGES } from "@/config/pages/partner.config";
import { PUBLIC_PAGES } from "@/config/pages/public.config";
import { protectLoginPages } from "@/server-actions/middlewares/protect-login.middleware";
import { protectAdminPages } from "./server-actions/middlewares/protect-admin.middleware";
import { protectPartnerPages } from "./server-actions/middlewares/protect-partner.middleware";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith(PUBLIC_PAGES.AUTH)) {
    return protectLoginPages(request);
  }

  if (pathname.startsWith(ADMIN_PAGES.HOME)) {
    return protectAdminPages(request);
  }

  if (pathname.startsWith(PARTNER_PAGES.HOME)) {
    return protectPartnerPages(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login"],
};
