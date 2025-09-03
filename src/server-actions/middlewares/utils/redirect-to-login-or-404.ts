import { ADMIN_PAGES } from "@/config/pages/admin.config";
import { PARTNER_PAGES } from "@/config/pages/partner.config";
import { PUBLIC_PAGES } from "@/config/pages/public.config";
import { NextRequest } from "next/server";
import { nextRedirect } from "./next-redirect";

export const redirectToLoginOrNotFound = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const isAdminPage = pathname.startsWith(ADMIN_PAGES.HOME);
  const isPartnerPage = pathname.startsWith(PARTNER_PAGES.HOME);

  if (isAdminPage || isPartnerPage) {
    return nextRedirect("/not-found", request.url);
  }

  return nextRedirect(PUBLIC_PAGES.LOGIN, request.url);
};
