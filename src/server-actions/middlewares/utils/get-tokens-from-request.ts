import { AuthToken } from "@/shared/types/auth.types";
import { NextRequest } from "next/server";
import { getNewTokensByRefresh } from "./get-new-tokens-by-refresh";

export async function getTokensFromRequest(request: NextRequest) {
  const refresh_token = request.cookies.get(AuthToken.REFRESH_TOKEN)?.value;
  let access_token = request.cookies.get(AuthToken.ACCESS_TOKEN)?.value;

  if (!refresh_token) {
    request.cookies.delete(AuthToken.ACCESS_TOKEN);
    return null;
  }

  if (!access_token) {
    try {
      const data = await getNewTokensByRefresh(refresh_token);
      access_token = data.access_token;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "invalid token") {
          console.log("не валидный токен");
          request.cookies.delete(AuthToken.ACCESS_TOKEN);
          return null;
        }
      }
      return null;
    }
  }

  return { access_token, refresh_token };
}
